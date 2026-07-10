package br.com.mage.certmanager.dto;


import br.com.mage.certmanager.enums.CertificateStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CertificateUpdateRequestDTO {

    private String cnpj;
    private String companyName;
    private LocalDate validUntil;
    private CertificateStatus status;
    private LocalDate validFrom;
    private String contactName;
    private String contactPhone;
    private String issuer;
    private Boolean issuedByUs;
    private Double renewalValue;
}
