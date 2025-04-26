package Backend.controller;

import Backend.entities.dto.UserDto;
import Backend.entities.dto.UserRegisterDto;
import Backend.entities.dto.UserResponseDto;
import Backend.services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")


public class AuthenticationController {
    @Autowired
    AuthenticationService authenticationService;

    @PostMapping("/canRegister")
    public ResponseEntity<UserResponseDto> candidateRegister(@RequestBody UserRegisterDto user){
        return ResponseEntity.ok(authenticationService.canSave(user));
    }
    @PostMapping("/empRegister")
    public ResponseEntity<UserResponseDto> employerRegister(@RequestBody UserRegisterDto user){
        return ResponseEntity.ok(authenticationService.empSave(user));
    }

    @PostMapping("/auth")
    public ResponseEntity<UserResponseDto> auth(@RequestBody UserDto user){
        return ResponseEntity.ok(authenticationService.auth(user));
    }









}