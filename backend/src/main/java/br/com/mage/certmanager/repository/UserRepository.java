package br.com.mage.certmanager.repository;

import br.com.mage.certmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
