package br.com.mage.certmanager.controller;


import br.com.mage.certmanager.dto.CertificateCreateRequestDTO;
import br.com.mage.certmanager.dto.CertificateResponseDTO;
import br.com.mage.certmanager.dto.CertificateUpdateRequestDTO;
import br.com.mage.certmanager.service.CertificateService;
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
        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificateResponseDTO> listCertificateById(@PathVariable Long id){
        return null;
    }

    @PostMapping
    public ResponseEntity<CertificateResponseDTO> createCertificate(@RequestBody CertificateCreateRequestDTO dto){
        CertificateResponseDTO certificate = certificateService.createCertificate(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(certificate);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CertificateResponseDTO> updateCertificate(@RequestBody CertificateUpdateRequestDTO uDto, @PathVariable Long id){
        return null;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id){
        return null;
    }


    @GetMapping("/expired")
    public ResponseEntity<List<CertificateResponseDTO>> expiredCertificates(){

        return null;
    }
}
