package br.com.mage.certmanager.service;

import br.com.mage.certmanager.entity.User;
import br.com.mage.certmanager.exception.UserNotFoundException;
import br.com.mage.certmanager.mapper.UserMapper;
import br.com.mage.certmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.com.mage.certmanager.dto.*;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper mapper;

    public List<UserResponseDTO> listAllUsers(){

        List<User> listUsers = userRepository.findAll();

        return listUsers.stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    public UserResponseDTO createUser(UserCreateRequestDTO dto){
        User user = mapper.toEntity(dto);
        User savedUser = userRepository.save(user);

        return mapper.toResponse(savedUser);
    }

    public UserResponseDTO listUserById(Long id){
        User user = userRepository.findById(id).orElseThrow(
                () -> new UserNotFoundException(id)
        );

        return mapper.toResponse(user);
    }

    public UserResponseDTO updateUser(Long id, UserUpdateRequestDTO dtoUpd){
        User user = userRepository.findById(id).orElseThrow(
                () -> new UserNotFoundException(id)
        );

        if(dtoUpd.getName() != null){
            user.setName(dtoUpd.getName());
        }
        if(dtoUpd.getEmail() != null){
            user.setEmail(dtoUpd.getEmail());
        }
        if(dtoUpd.getPassword() != null){
            user.setPassword(dtoUpd.getPassword());
        }
        if(dtoUpd.getRole() != null){
            user.setRole(dtoUpd.getRole());
        }

        User savedUser = userRepository.save(user);

        return mapper.toResponse(savedUser);
    }

    public void deleteUser(Long id){
        User user = userRepository.findById(id).orElseThrow(
                () -> new UserNotFoundException(id)
        );

        userRepository.delete(user);
    }
}
