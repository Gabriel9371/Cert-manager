package br.com.mage.certmanager.service;

import br.com.mage.certmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;

    public List<UserResponseDTO> listAllUsers(){

        return null;
    }

    public UserResponseDTO createUser(UserCreateRequestDTO dto){
        return null;
    }

    public UserResponseDTO listUserById(Long id){
        return null;
    }

    public UserResponseDTO  updateUser(Long id, UserUpdateRequest dtoUpd){
        return null;
    }

    public void deleteUser(Long id){

    }
}
