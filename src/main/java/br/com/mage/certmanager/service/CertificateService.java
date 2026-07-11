package br.com.mage.certmanager.service;

import br.com.mage.certmanager.dto.CertificateCreateRequestDTO;
import br.com.mage.certmanager.dto.CertificateResponseDTO;
import br.com.mage.certmanager.dto.CertificateUpdateRequestDTO;
import br.com.mage.certmanager.dto.StatusCertificateDTO;
import br.com.mage.certmanager.entity.Certificate;
import br.com.mage.certmanager.entity.CertificatesStatusHistory;
import br.com.mage.certmanager.enums.CertificateStatus;
import br.com.mage.certmanager.exception.CertificateNotFoundException;
import br.com.mage.certmanager.mapper.CertificateMapper;
import br.com.mage.certmanager.repository.CertificateRepository;

import br.com.mage.certmanager.repository.CertificatesStatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CertificateService {
    private final CertificateRepository certificateRepository;
    private final CertificateMapper certificateMapper;
    private final CertificatesStatusHistoryRepository historyRepository;

    public CertificateResponseDTO createCertificate(CertificateCreateRequestDTO dto){

        Certificate certificate = certificateMapper.toEntity(dto);
        certificate.setStatus(CertificateStatus.ACTIVE);

        Certificate savedCertificate = certificateRepository.save(certificate);

        return certificateMapper.toResponse(savedCertificate);

    }

    public List<CertificateResponseDTO> listAllCertificates(){

        List<Certificate> certificates = certificateRepository.findAll();

        return certificates.stream().map(certificateMapper::toResponse).collect(Collectors.toList());
    }

    public CertificateResponseDTO updateCertificate(CertificateUpdateRequestDTO dtoatt, Long id){

        Certificate certificate = certificateRepository.findById(id).orElseThrow(
                () -> new CertificateNotFoundException(id)
        );

        if (dtoatt.getCnpj() != null){
            certificate.setCnpj(dtoatt.getCnpj());
        }
        if (dtoatt.getCompanyName() != null){
            certificate.setCompanyName(dtoatt.getCompanyName());
        }
        if(dtoatt.getValidUntil() != null){
            certificate.setValidUntil(dtoatt.getValidUntil());
        }
        if(dtoatt.getStatus() != null){
            certificate.setStatus(dtoatt.getStatus());
        }
        if (dtoatt.getValidFrom() != null){
            certificate.setValidFrom(dtoatt.getValidFrom());
        }
        if (dtoatt.getContactName() != null){
            certificate.setContactName(dtoatt.getContactName());
        }
        if (dtoatt.getContactPhone() != null){
            certificate.setContactPhone(dtoatt.getContactPhone());
        }
        if(dtoatt.getIssuer() != null){
            certificate.setIssuer(dtoatt.getIssuer());
        }
        if(dtoatt.getIssuedByUs() != null){
            certificate.setIssuedByUs(dtoatt.getIssuedByUs());
        }
        if(dtoatt.getRenewalValue() != null){
            certificate.setRenewalValue(dtoatt.getRenewalValue());
        }

        certificate.setUpdatedAt(LocalDateTime.now());
        Certificate savedCertificate = certificateRepository.save(certificate);

        return certificateMapper.toResponse(savedCertificate);
    }

    public void deleteCertificate(Long id){

        Certificate certificate = certificateRepository.findById(id).orElseThrow(
                () -> new CertificateNotFoundException(id)
        );

        certificateRepository.delete(certificate);
    }

    public CertificateResponseDTO listCertificateById(Long id){

        Certificate certificate = certificateRepository.findById(id).orElseThrow(
                () -> new CertificateNotFoundException(id)
        );

        return certificateMapper.toResponse(certificate);
    }

    public CertificateResponseDTO updateStatusCertificate(Long id, StatusCertificateDTO dto){


        Certificate certificate = certificateRepository.findById(id).orElseThrow(
                () -> new CertificateNotFoundException(id)
        );

        CertificateStatus previus = certificate.getStatus();

        certificate.setStatus(dto.getStatus());
        Certificate savedCertificate = certificateRepository.save(certificate);


        CertificatesStatusHistory history = new CertificatesStatusHistory();
        history.setPreviousStatus(previus);
        history.setNewStatus(certificate.getStatus());
        history.setChangedAt(LocalDateTime.now());
        history.setCertificate(savedCertificate);

        historyRepository.save(history);

        return certificateMapper.toResponse(savedCertificate);


    }


    @Scheduled(cron = "0 0 8 * * *")
    public void checkExpirations(){
        List<Certificate> certificates = certificateRepository.findAll();
        for (int i=0; i<certificates.size(); i++){

            if(certificates.get(i).getValidUntil().isBefore(LocalDate.now())){

                certificates.get(i).setStatus(CertificateStatus.EXPIRED);
            }
            else if (certificates.get(i).getValidUntil().isBefore(LocalDate.now().plusDays(30))) {

                certificates.get(i).setStatus(CertificateStatus.TO_RENEW);

            }

            certificateRepository.save(certificates.get(i));

        }

    }

    //TODO-  Voltar para modificar, feito como teste...
    public List<CertificateResponseDTO> listExpiredCertificates(){
        List<Certificate> certificates = certificateRepository.findByStatus(CertificateStatus.EXPIRED);

        return certificates.stream().map(
                certificateMapper::toResponse
        ).toList();
    }

}