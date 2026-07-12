package br.com.mage.certmanager.dto;

import br.com.mage.certmanager.enums.UserRole;
import lombok.Data;

@Data
public class UserResponseDTO {
    private Long id;
    private UserRole role;
    private String name;
    private String email;

}
