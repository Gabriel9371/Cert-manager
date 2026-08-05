package br.com.mage.certmanager.mapper;

import br.com.mage.certmanager.dto.UserCreateRequestDTO;
import br.com.mage.certmanager.dto.UserResponseDTO;
import br.com.mage.certmanager.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponseDTO toResponse(User usr);
    User toEntity(UserCreateRequestDTO dto);
}
