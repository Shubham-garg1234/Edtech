package com.edtech.edtch.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.edtech.edtch.models.LoginRequest;
import com.edtech.edtch.models.LoginResponse;
import com.edtech.edtch.repositories.CartRepo;
import com.edtech.edtch.repositories.UserEnrollmentRepo;
import com.edtech.edtch.repositories.UserRepo;
import com.edtech.edtch.models.Users;

@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private UserEnrollmentRepo userEnrollmentRep;

    public AuthService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public ResponseEntity<?> verifyUser(LoginRequest loginRequest) {
        Users user = userRepo.findByEmail(loginRequest.getEmail());
        int count = cartRepo.countByUserId(user.getUserId());
        List<Integer> purchasedCourse=userEnrollmentRep.findByUserId(user.getUserId());

        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
            LoginResponse loginResponse = new LoginResponse(user.getUserId(), user.getUserName(),count,purchasedCourse);
            return ResponseEntity.ok(loginResponse);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");  // Return 401 if credentials are incorrect
        }
    }
}
