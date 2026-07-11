package br.com.mage.certmanager.repository;

import br.com.mage.certmanager.entity.Certificate;
import br.com.mage.certmanager.enums.CertificateStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByStatus(CertificateStatus status);
}
