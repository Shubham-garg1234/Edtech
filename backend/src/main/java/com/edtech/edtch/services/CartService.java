package com.edtech.edtch.services;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.edtech.edtch.models.UserEnrollments;
import com.edtech.edtch.repositories.UserEnrollmentRepo;
import com.edtech.edtch.models.Cart;
import com.edtech.edtch.models.CartResponse;
import com.edtech.edtch.models.Courses;
import com.edtech.edtch.models.Users;
import com.edtech.edtch.repositories.CartRepo;
import com.edtech.edtch.repositories.CoursesRepo;
import com.edtech.edtch.repositories.UserRepo;
import com.edtech.edtch.utils.JwtUtil;
import jakarta.transaction.Transactional;

@Service
public class CartService {

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private CoursesRepo courseRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserEnrollmentRepo userEnrollmentRepo;

    @Autowired
    private JwtUtil jwtUtil;

    public List<CartResponse> getCartItems(String accessToken) {
        String userId_str = jwtUtil.validateToken(accessToken).getSubject();
        int userId = Integer.parseInt(userId_str);
        Users user = userRepo.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }

        List<Integer>allCourseId=cartRepo.findAllByUserId(user.getUserId());
        List<Courses>cartCourses=courseRepo.findAllById(allCourseId);
        List<CartResponse>cartResponse=new ArrayList<>();
        for(Courses course:cartCourses){
            CartResponse cartResponsedata= new CartResponse();
            cartResponsedata.setCourseid(course.getCourseId());
            cartResponsedata.setCourseName(course.getCourseName());
            cartResponsedata.setPrice(course.getPrice());
            cartResponsedata.setCourseImageURL(course.getCourseImageURL());
            cartResponse.add(cartResponsedata);
        }
        return cartResponse;
    }

    @Transactional
    public ResponseEntity<?> deleteItem(String accessToken , int courseId) {
        String userId_str = jwtUtil.validateToken(accessToken).getSubject();
        int userId = Integer.parseInt(userId_str);
        Users user = userRepo.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        int rowsDeleted = cartRepo.deleteItem(userId, courseId);
        if (rowsDeleted > 0) {
            return ResponseEntity.ok("Item successfully deleted from cart.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item not found in the cart.");
        }
    }

    @Transactional
    public ResponseEntity<?> addItem(String accessToken , Integer courseId) {
        String userId_str = jwtUtil.validateToken(accessToken).getSubject();
        int userId = Integer.parseInt(userId_str);
        Users user = userRepo.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
        
        Courses course = courseRepo.findById(courseId).orElse(null);
        if (course == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found.");
        }
        List<Integer> userCart = cartRepo.findAllByUserId(user.getUserId());
        if (userCart.contains(courseId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Item is already in the cart.");
        }
        try {
            Cart newCartItem = new Cart();
            newCartItem.setUser(user);
            newCartItem.setCourse(course);
            cartRepo.save(newCartItem);
            return ResponseEntity.ok("Item successfully added to cart.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add item to cart.");
        }
    }

    @Transactional
    public ResponseEntity<?> purchaseCourses(String accessToken , List<Integer> courseIds){
        String userId_str = jwtUtil.validateToken(accessToken).getSubject();
        int userId = Integer.parseInt(userId_str);
        Users user = userRepo.findById(userId).orElse(null);
        if(user == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        for (int courseId : courseIds) {
            Courses course = courseRepo.findById(courseId).orElse(null);
            if (course != null) {
                UserEnrollments userEnrollment = new UserEnrollments();
                userEnrollment.setUser(user);
                userEnrollment.setCourse(course);
                userEnrollmentRepo.save(userEnrollment);
                cartRepo.deleteItem(user.getUserId(), courseId);
            }
        }

        return ResponseEntity.status(200).body("Courses Purchased Successfully");
    }
}
