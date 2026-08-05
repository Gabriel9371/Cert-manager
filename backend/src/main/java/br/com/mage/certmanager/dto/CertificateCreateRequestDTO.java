package br.com.mage.certmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CertificateCreateRequestDTO {

    @NotBlank
    private String cnpj;

    @NotBlank
    private String companyName;

    @NotNull
    private LocalDate validUntil;


    @NotNull
    private LocalDate validFrom;

    @NotBlank
    private String contactName;

    @NotBlank
    private String contactPhone;

    @NotBlank
    private String issuer;

    @NotNull
    private Boolean issuedByUs;

    private Double renewalValue;

    private Long createdByUserId;
}
