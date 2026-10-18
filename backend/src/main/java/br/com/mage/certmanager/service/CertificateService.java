package br.com.mage.certmanager.service;

import br.com.mage.certmanager.dto.CertificateCreateRequestDTO;
import br.com.mage.certmanager.dto.CertificateResponseDTO;
import br.com.mage.certmanager.dto.CertificateUpdateRequestDTO;
import br.com.mage.certmanager.dto.RenewCertificateRequestDTO;
import br.com.mage.certmanager.dto.StatusCertificateDTO;
import br.com.mage.certmanager.entity.Certificate;
import br.com.mage.certmanager.entity.CertificatesStatusHistory;
import br.com.mage.certmanager.entity.User;
import br.com.mage.certmanager.enums.CertificateStatus;
import br.com.mage.certmanager.exception.CertificateNotFoundException;
import br.com.mage.certmanager.exception.UserNotFoundException;
import br.com.mage.certmanager.mapper.CertificateMapper;
import br.com.mage.certmanager.repository.CertificateRepository;
import br.com.mage.certmanager.repository.CertificatesStatusHistoryRepository;
import br.com.mage.certmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class CertificateService {

    // Quantos dias antes do vencimento o certificado passa a "A renovar".
    private static final int RENEWAL_WINDOW_DAYS = 30;

    private final CertificateRepository certificateRepository;
    private final CertificateMapper certificateMapper;
    private final CertificatesStatusHistoryRepository historyRepository;

    //Temp
    private final UserRepository userRepository;

    // ---------- CRUD ----------

    public CertificateResponseDTO createCertificate(CertificateCreateRequestDTO dto) {
        User createdBy = findUser(dto.getCreatedByUserId());

        Certificate certificate = certificateMapper.toEntity(dto);
        certificate.setStatus(statusFor(dto.getValidUntil()));
        certificate.setCreatedAt(LocalDateTime.now());
        certificate.setCreatedBy(createdBy);

        Certificate saved = certificateRepository.save(certificate);

        return certificateMapper.toResponse(saved);
    }

    public List<CertificateResponseDTO> listAllCertificates() {
        return certificateRepository.findAll().stream()
                .map(certificateMapper::toResponse)
                .toList();
    }

    public CertificateResponseDTO listCertificateById(Long id) {
        return certificateMapper.toResponse(findCertificate(id));
    }

    @Transactional
    public CertificateResponseDTO updateCertificate(CertificateUpdateRequestDTO dto, Long id) {
        Certificate certificate = findCertificate(id);

        if (dto.getCnpj() != null) {
            certificate.setCnpj(dto.getCnpj());
        }
        if (dto.getCompanyName() != null) {
            certificate.setCompanyName(dto.getCompanyName());
        }
        if (dto.getValidUntil() != null) {
            certificate.setValidUntil(dto.getValidUntil());
        }
        if (dto.getValidFrom() != null) {
            certificate.setValidFrom(dto.getValidFrom());
        }
        if (dto.getContactName() != null) {
            certificate.setContactName(dto.getContactName());
        }
        if (dto.getContactPhone() != null) {
            certificate.setContactPhone(dto.getContactPhone());
        }
        if (dto.getIssuer() != null) {
            certificate.setIssuer(dto.getIssuer());
        }
        if (dto.getIssuedByUs() != null) {
            certificate.setIssuedByUs(dto.getIssuedByUs());
        }
        if (dto.getRenewalValue() != null) {
            certificate.setRenewalValue(dto.getRenewalValue());
        }

        // Se a data mudou, o status acompanha na hora (sem esperar o cron).
        refreshStatus(certificate, null);

        certificate.setUpdatedAt(LocalDateTime.now());
        Certificate saved = certificateRepository.save(certificate);

        return certificateMapper.toResponse(saved);
    }

    public void deleteCertificate(Long id) {
        certificateRepository.delete(findCertificate(id));
    }

    // ---------- Status e renovação ----------

    /**
     * RENEWING é o único status manual. Os demais são calculados pela data.
     * - RENEWING: marca a renovação como em andamento.
     * - ACTIVE: cancela a renovação; o sistema recalcula pela data
     *   (pode virar TO_RENEW ou EXPIRED, se for o caso).
     */
    @Transactional
    public CertificateResponseDTO updateStatusCertificate(Long id, StatusCertificateDTO dto) {
        Certificate certificate = findCertificate(id);
        User changedBy = dto.getChangedByUserId() == null
                ? null
                : findUser(dto.getChangedByUserId());

        switch (dto.getStatus()) {
            case RENEWING -> changeStatus(certificate, CertificateStatus.RENEWING, changedBy);
            case ACTIVE -> {
                if (certificate.getStatus() != CertificateStatus.RENEWING) {
                    throw badRequest("Só é possível cancelar uma renovação que está em andamento.");
                }
                changeStatus(certificate, statusFor(certificate.getValidUntil()), changedBy);
            }
            default -> throw badRequest(
                    "Apenas RENEWING e ACTIVE podem ser definidos manualmente; os demais status são calculados pela data.");
        }

        Certificate saved = certificateRepository.save(certificate);

        return certificateMapper.toResponse(saved);
    }

    /**
     * Renova o MESMO registro: novas datas, registra quem renovou e
     * recalcula o status pela nova validade.
     */
    @Transactional
    public CertificateResponseDTO renewCertificate(Long id, RenewCertificateRequestDTO dto) {
        Certificate certificate = findCertificate(id);
        User renewedBy = findUser(dto.getRenewedByUserId());

        if (!dto.getValidUntil().isAfter(dto.getValidFrom())) {
            throw badRequest("A nova data de vencimento deve ser posterior à data de início.");
        }

        certificate.setValidFrom(dto.getValidFrom());
        certificate.setValidUntil(dto.getValidUntil());
        if (dto.getRenewalValue() != null) {
            certificate.setRenewalValue(dto.getRenewalValue());
        }
        certificate.setRenewedBy(renewedBy);
        certificate.setUpdatedAt(LocalDateTime.now());

        changeStatus(certificate, statusFor(dto.getValidUntil()), renewedBy);

        Certificate saved = certificateRepository.save(certificate);

        return certificateMapper.toResponse(saved);
    }

    // ---------- Rotina automática ----------

    @Scheduled(cron = "0 0 8 * * *")
    @Transactional
    public void checkExpirations() {
        for (Certificate certificate : certificateRepository.findAll()) {
            if (refreshStatus(certificate, null)) {
                certificateRepository.save(certificate);
            }
        }
    }

    // Roda também ao subir a aplicação: se a máquina estava desligada às 8h, o status se corrige aqui.
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void checkExpirationsOnStartup() {
        checkExpirations();
    }

    //TODO-  Voltar para modificar, feito como teste...
    public List<CertificateResponseDTO> listExpiredCertificates() {
        return certificateRepository.findByStatus(CertificateStatus.EXPIRED).stream()
                .map(certificateMapper::toResponse)
                .toList();
    }

    // ---------- Auxiliares ----------

    // Regra pura: status esperado para uma data de vencimento.
    private CertificateStatus statusFor(LocalDate validUntil) {
        LocalDate today = LocalDate.now();

        if (validUntil.isBefore(today)) {
            return CertificateStatus.EXPIRED;
        }
        if (validUntil.isBefore(today.plusDays(RENEWAL_WINDOW_DAYS))) {
            return CertificateStatus.TO_RENEW;
        }
        return CertificateStatus.ACTIVE;
    }

    // Recalcula o status pela data, respeitando RENEWING. Devolve true se mudou.
    private boolean refreshStatus(Certificate certificate, User changedBy) {
        if (certificate.getStatus() == CertificateStatus.RENEWING
                || certificate.getValidUntil() == null) {
            return false;
        }
        return changeStatus(certificate, statusFor(certificate.getValidUntil()), changedBy);
    }

    // Único ponto que muda status e grava histórico. Devolve true se mudou.
    private boolean changeStatus(Certificate certificate, CertificateStatus newStatus, User changedBy) {
        CertificateStatus previous = certificate.getStatus();
        if (previous == newStatus) {
            return false;
        }

        certificate.setStatus(newStatus);

        CertificatesStatusHistory history = new CertificatesStatusHistory();
        history.setPreviousStatus(previous);
        history.setNewStatus(newStatus);
        history.setChangedAt(LocalDateTime.now());
        history.setChangedBy(changedBy);
        history.setCertificate(certificate);
        historyRepository.save(history);

        return true;
    }

    private Certificate findCertificate(Long id) {
        return certificateRepository.findById(id)
                .orElseThrow(() -> new CertificateNotFoundException(id));
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    private ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}