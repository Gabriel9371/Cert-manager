package br.com.mage.certmanager.dto;

import br.com.mage.certmanager.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserCreateRequestDTO {

    @NotBlank
    private String name;
    @NotNull
    private UserRole role;
    @NotBlank
    @Email
    private String email;
    @NotBlank
    private String password;

}
