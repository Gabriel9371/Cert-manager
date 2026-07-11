package br.com.mage.certmanager.controller;


import br.com.mage.certmanager.dto.UserCreateRequestDTO;
import br.com.mage.certmanager.dto.UserResponseDTO;
import br.com.mage.certmanager.dto.UserUpdateRequestDTO;
import br.com.mage.certmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> listAllUsers(){
        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> listUserById(@PathVariable Long id){
        return  null;
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserCreateRequestDTO dto){
        return null;
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@RequestBody UserUpdateRequestDTO dto, @PathVariable Long id){
        return null;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id){
        return null;
    }
}
