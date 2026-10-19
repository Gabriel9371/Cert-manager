package br.com.mage.certmanager.controller;

import br.com.mage.certmanager.dto.CertificateCreateRequestDTO;
import br.com.mage.certmanager.dto.CertificateResponseDTO;
import br.com.mage.certmanager.dto.CertificateUpdateRequestDTO;
import br.com.mage.certmanager.dto.RenewCertificateRequestDTO;
import br.com.mage.certmanager.dto.StatusCertificateDTO;
import br.com.mage.certmanager.service.CertificateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @GetMapping
    public ResponseEntity<List<CertificateResponseDTO>> listAllCertificates() {
        return ResponseEntity.ok(certificateService.listAllCertificates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificateResponseDTO> listCertificateById(@PathVariable Long id) {
        return ResponseEntity.ok(certificateService.listCertificateById(id));
    }

    @PostMapping
    public ResponseEntity<CertificateResponseDTO> createCertificate(@RequestBody @Valid CertificateCreateRequestDTO dto) {
        CertificateResponseDTO certificate = certificateService.createCertificate(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(certificate);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CertificateResponseDTO> updateCertificate(@RequestBody @Valid CertificateUpdateRequestDTO uDto, @PathVariable Long id) {
        return ResponseEntity.ok(certificateService.updateCertificate(uDto, id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CertificateResponseDTO> updateStatus(@RequestBody @Valid StatusCertificateDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(certificateService.updateStatusCertificate(id, dto));
    }

    @PostMapping("/{id}/renew")
    public ResponseEntity<CertificateResponseDTO> renewCertificate(@RequestBody @Valid RenewCertificateRequestDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(certificateService.renewCertificate(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id) {
        certificateService.deleteCertificate(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/expired")
    public ResponseEntity<List<CertificateResponseDTO>> expiredCertificates() {
        return ResponseEntity.ok(certificateService.listExpiredCertificates());
    }
}