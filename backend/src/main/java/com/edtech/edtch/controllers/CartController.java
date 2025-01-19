package com.edtech.edtch.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edtech.edtch.models.CartResponse;
import com.edtech.edtch.models.ModifyCartRequest;
import com.edtech.edtch.models.PurchaseRequest;
import com.edtech.edtch.models.LoginResponse;
import com.edtech.edtch.services.CartService;

@RestController
@CrossOrigin
@RequestMapping("/api/v1")
public class CartController {

    @Autowired
    CartService cartService;

    @PostMapping("/getCartItems")
    public List<CartResponse> getCartItems(@RequestBody LoginResponse user){
        return cartService.getCartItems(user.getUserId());
    }
    @PostMapping("/deleteItem")
    public ResponseEntity<?> deleteItem(@RequestBody ModifyCartRequest request) {
        Integer userId = request.getUserId();
        Integer courseId = request.getCourseId();
        return cartService.deleteItem(userId, courseId);
    }
    @PostMapping("/addItem")
    public ResponseEntity<?> addItem(@RequestBody ModifyCartRequest request) {
        Integer userId = request.getUserId();
        Integer courseId = request.getCourseId();
        return cartService.addItem(userId, courseId);
    }

    @PostMapping("/purchaseCourses")
    public void purchaseCourses(@RequestBody PurchaseRequest purchaseRequest) {
        cartService.purchaseCourses(purchaseRequest);
    }
}
