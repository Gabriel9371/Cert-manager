package br.com.mage.certmanager.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RenewCertificateRequestDTO {

    @NotNull
    private LocalDate validFrom;

    @NotNull
    private LocalDate validUntil;

    private Double renewalValue;

    @NotNull
    private Long renewedByUserId;
}