package br.com.mage.certmanager.entity;


import br.com.mage.certmanager.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private UserRole role;
    private String email;
    private String password;
}
