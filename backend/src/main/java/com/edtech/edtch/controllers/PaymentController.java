    package com.edtech.edtch.controllers;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.CrossOrigin;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RequestParam;
    import org.springframework.web.bind.annotation.RestController;

import com.edtech.edtch.models.VerifyPaymentRequest;
import com.edtech.edtch.services.PaymentService;

    @RestController

    @RequestMapping("/razorpay/v1")
    @CrossOrigin
    public class PaymentController {

        @Autowired
        private PaymentService paymentService;

        @GetMapping("/createOrder")
        public String createOrder(@RequestParam double amount, @RequestParam String currency) {
        try {
            return paymentService.createOrder(amount, currency);
        } catch (Exception e) {
            return e.getMessage();
        }
        }

    @PostMapping("/verify")
        public ResponseEntity<?> verifyPayment(@RequestBody VerifyPaymentRequest data) {
            try {
                boolean isValid = paymentService.verifyPayment(data.getOrderId(), data.getPaymentId(), data.getRazorpaySignature());
                if (isValid) {
                return ResponseEntity.ok("Payment verified successfully");
                } else {
                return ResponseEntity.status(400).body("Payment verification failed");
                }
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error verifying payment");
            }
        }
    }