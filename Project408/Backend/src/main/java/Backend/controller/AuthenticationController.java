package Backend.controller;

import Backend.entities.dto.UserDto;
import Backend.entities.dto.UserRegisterDto;
import Backend.entities.dto.UserResponseDto;
import Backend.services.AuthenticationService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")


public class AuthenticationController {
    @Autowired
    AuthenticationService authenticationService;

    @PostMapping("/canRegister")
    public ResponseEntity<UserResponseDto> candidateRegister(@RequestBody UserRegisterDto user) throws Exception {
        if(!user.getEmail().isEmpty() && !user.getPassword().isEmpty() && !user.getFirstName().isEmpty() && !user.getLastName().isEmpty()){
            return ResponseEntity.ok(authenticationService.canSave(user));
        }
        return ResponseEntity.badRequest().build();
    }
    @PostMapping("/empRegister")
    public ResponseEntity<UserResponseDto> employerRegister(@RequestBody UserRegisterDto user) throws Exception {
        if(!user.getEmail().isEmpty() && !user.getPassword().isEmpty() && !user.getFirstName().isEmpty() && !user.getLastName().isEmpty()){
            return ResponseEntity.ok(authenticationService.empSave(user));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/auth")
    public ResponseEntity<UserResponseDto> auth(@RequestBody UserDto user){
        return ResponseEntity.ok(authenticationService.auth(user));
    }









}