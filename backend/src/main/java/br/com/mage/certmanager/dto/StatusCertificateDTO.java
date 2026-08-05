package br.com.mage.certmanager.dto;

import br.com.mage.certmanager.enums.CertificateStatus;
import lombok.Data;

@Data
public class StatusCertificateDTO {
    private CertificateStatus status;
}
