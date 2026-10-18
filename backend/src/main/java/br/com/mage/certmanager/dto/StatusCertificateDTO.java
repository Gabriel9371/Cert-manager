package br.com.mage.certmanager.dto;

import br.com.mage.certmanager.enums.CertificateStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusCertificateDTO {

    @NotNull
    private CertificateStatus status;

    //o front informa quem fez a mudança.
    private Long changedByUserId;
}