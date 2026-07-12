package br.com.mage.certmanager.controller;


import br.com.mage.certmanager.dto.CertificateCreateRequestDTO;
import br.com.mage.certmanager.dto.CertificateResponseDTO;
import br.com.mage.certmanager.dto.CertificateUpdateRequestDTO;
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
    public ResponseEntity<List<CertificateResponseDTO>> listAllCertificates(){
        List<CertificateResponseDTO> certificates = certificateService.listAllCertificates();

        return ResponseEntity.ok(certificates);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificateResponseDTO> listCertificateById(@PathVariable Long id){
        CertificateResponseDTO certificate = certificateService.listCertificateById(id);

        return ResponseEntity.ok(certificate);
    }

    @PostMapping
    public ResponseEntity<CertificateResponseDTO> createCertificate(@RequestBody @Valid  CertificateCreateRequestDTO dto){
        CertificateResponseDTO certificate = certificateService.createCertificate(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(certificate);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CertificateResponseDTO> updateCertificate(@RequestBody @Valid CertificateUpdateRequestDTO uDto, @PathVariable Long id){
        CertificateResponseDTO certificate = certificateService.updateCertificate(uDto, id);

        return ResponseEntity.ok(certificate);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id){
        certificateService.deleteCertificate(id);

        return ResponseEntity.noContent().build();
    }


    @GetMapping("/expired")
    public ResponseEntity<List<CertificateResponseDTO>> expiredCertificates(){

        List<CertificateResponseDTO> certificatesExpireds = certificateService.listExpiredCertificates();

        return ResponseEntity.ok(certificatesExpireds);
    }
}
