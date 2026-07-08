package br.com.mage.certmanager.repository;

import br.com.mage.certmanager.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
}
