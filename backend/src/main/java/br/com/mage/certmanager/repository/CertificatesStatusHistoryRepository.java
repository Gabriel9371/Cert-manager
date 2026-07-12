package br.com.mage.certmanager.repository;

import br.com.mage.certmanager.entity.CertificatesStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificatesStatusHistoryRepository extends JpaRepository<CertificatesStatusHistory, Long> {

}
