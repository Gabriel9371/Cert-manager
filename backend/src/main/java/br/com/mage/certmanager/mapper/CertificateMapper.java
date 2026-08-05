package br.com.mage.certmanager.mapper;

import br.com.mage.certmanager.dto.CertificateCreateRequestDTO;
import br.com.mage.certmanager.dto.CertificateResponseDTO;
import br.com.mage.certmanager.entity.Certificate;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CertificateMapper {
    CertificateResponseDTO toResponse(Certificate cert);
    Certificate toEntity(CertificateCreateRequestDTO dto);
}
