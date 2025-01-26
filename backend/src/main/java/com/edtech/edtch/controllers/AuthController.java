package com.edtech.edtch.controllers;

import com.edtech.edtch.models.LoginRequest;
import com.edtech.edtch.models.RegisterRequest;
import com.edtech.edtch.services.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/api/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        return authService.loginUser(loginRequest , response);
    }

    @PostMapping("/api/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest){
        return authService.registerUser(registerRequest);
    }

    @GetMapping("/api/getNewAccessToken")
    public ResponseEntity<?> getNewAccessToken(@CookieValue(required = true) String refreshToken , HttpServletResponse response){
        return authService.getNewAccessToken(refreshToken , response);
    }

    @GetMapping("/getUserDetails")
    public ResponseEntity<?> getUserDetails(@CookieValue(required = true) String accessToken){
        return authService.getUserDetails(accessToken);
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logoutUser(@CookieValue(required = true) String accessToken , HttpServletResponse response){
        return authService.logoutUser(accessToken , response);
    }

}
