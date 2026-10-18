package br.com.mage.certmanager.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CertificateUpdateRequestDTO {

    private String cnpj;
    private String companyName;
    private LocalDate validUntil;
    private LocalDate validFrom;
    private String contactName;
    private String contactPhone;
    private String issuer;
    private Boolean issuedByUs;
    private Double renewalValue;
}