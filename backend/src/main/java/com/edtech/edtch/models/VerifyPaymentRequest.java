package com.edtech.edtch.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class VerifyPaymentRequest {
    private String orderId;
    private String paymentId;
    private String razorpaySignature;
}
