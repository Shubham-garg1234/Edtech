package com.edtech.edtch.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.edtech.edtch.models.CartResponse;
import com.edtech.edtch.services.CartService;

@RestController
@CrossOrigin
public class CartController {

    @Autowired
    CartService cartService;

    @GetMapping("/api/getCartItems")
    public List<CartResponse> getCartItems(@CookieValue(required = true) String accessToken){
        return cartService.getCartItems(accessToken);
    }

    @PostMapping("/api/deleteItem")
    public ResponseEntity<?> deleteItem(@CookieValue(required = true) String accessToken, @RequestBody Integer courseId) {
        return cartService.deleteItem(accessToken , courseId);
    }   
    
    @PostMapping("/api/addItem")
    public ResponseEntity<?> addItem(@CookieValue(required = true) String accessToken , @RequestBody Integer courseId) {
        return cartService.addItem(accessToken , courseId);
    }

    @PostMapping("/api/purchaseCourses")
    public ResponseEntity<?> purchaseCourses(@CookieValue(required = true) String accessToken , @RequestBody List<Integer> courseIds) {
        return cartService.purchaseCourses(accessToken , courseIds);
    }
}
