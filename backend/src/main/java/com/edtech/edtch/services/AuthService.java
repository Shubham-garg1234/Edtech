package com.edtech.edtch.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.edtech.edtch.models.LoginRequest;
import com.edtech.edtch.models.LoginResponse;
import com.edtech.edtch.models.RegisterRequest;
import com.edtech.edtch.repositories.CartRepo;
import com.edtech.edtch.repositories.UserEnrollmentRepo;
import com.edtech.edtch.repositories.UserRepo;
import com.edtech.edtch.utils.JwtUtil;
import com.edtech.edtch.models.Users;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;

@Service
public class AuthService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private UserEnrollmentRepo userEnrollmentRep;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ResponseEntity<?> loginUser(LoginRequest loginRequest, HttpServletResponse response) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        Users user = userRepo.findByEmail(email);

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(400).body("Invalid credentials");
        }

        String accessToken = jwtUtil.generateAccessToken(String.valueOf(user.getUserId()));
        String refreshToken = jwtUtil.generateRefreshToken(String.valueOf(user.getUserId()));

        Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
        accessTokenCookie.setHttpOnly(false);
        accessTokenCookie.setSecure(false);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(24 * 60 * 60);
        response.addCookie(accessTokenCookie);

        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(false);
        refreshTokenCookie.setSecure(false);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(refreshTokenCookie);

        int count = cartRepo.countByUserId(user.getUserId());
        List<Integer> purchasedCourse=userEnrollmentRep.findByUserId(user.getUserId());
        LoginResponse loginResponse = new LoginResponse(user.getUserId(), user.getUserName(),count,purchasedCourse);
        return ResponseEntity.ok(loginResponse);
    }

    @Transactional
    public ResponseEntity<?> registerUser(RegisterRequest registerRequest) {
        String username = registerRequest.getUsername();
        String email = registerRequest.getEmail();
        String password = registerRequest.getPassword();

        Users user = userRepo.findByEmail(email);

        if (user != null) {
            return ResponseEntity.status(403).body("Email Already Exists");
        }

        user = new Users();
        user.setEmail(email);
        user.setUserName(username);
        user.setPassword(passwordEncoder.encode(password));
        userRepo.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    public ResponseEntity<?> getNewAccessToken(String refreshToken , HttpServletResponse response) {
        if(jwtUtil.isTokenExpired(refreshToken)){
            return ResponseEntity.status(400).body("Refresh token is invalid");
        }

        String userId = jwtUtil.validateToken(refreshToken).getSubject();
        String accessToken = jwtUtil.generateAccessToken(userId);

        Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
        accessTokenCookie.setHttpOnly(false);
        accessTokenCookie.setSecure(false);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(24 * 60 * 60);
        response.addCookie(accessTokenCookie);

        return ResponseEntity.status(200).body("New access token is generated");
    }

    public ResponseEntity<?> getUserDetails(String accessToken) {
        String userId = jwtUtil.validateToken(accessToken).getSubject();
        Users user = userRepo.findById(Integer.parseInt(userId)).orElse(null);

        if(user == null){
            return ResponseEntity.status(404).body("User not found");
        }

        int count = cartRepo.countByUserId(user.getUserId());
        List<Integer> purchasedCourse=userEnrollmentRep.findByUserId(user.getUserId());
        LoginResponse loginResponse = new LoginResponse(user.getUserId(), user.getUserName(),count,purchasedCourse);
        return ResponseEntity.ok(loginResponse);
    }

    public ResponseEntity<?> logoutUser(String accessToken , HttpServletResponse response) {
        return null;
    }
}
