package br.com.mage.certmanager.dto;

import br.com.mage.certmanager.enums.UserRole;
import lombok.Data;

@Data
public class UserUpdateRequestDTO {

    private String name;

    private UserRole role;


    private String email;

    private String password;
}
