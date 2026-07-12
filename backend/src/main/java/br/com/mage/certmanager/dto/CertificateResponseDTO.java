package br.com.mage.certmanager.dto;

import br.com.mage.certmanager.enums.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
public class CertificateResponseDTO {

    private Long id;
    private String cnpj;
    private String companyName;
    private LocalDate validUntil;
    private LocalDateTime updatedAt;
    private CertificateStatus status;
    private LocalDate validFrom;
    private String contactName;
    private String contactPhone;
    private String issuer;
    private Boolean issuedByUs;
    private Double renewalValue;
    private LocalDateTime createdAt;
    private UserResponseDTO createdBy;
    private UserResponseDTO renewedBy;

}
