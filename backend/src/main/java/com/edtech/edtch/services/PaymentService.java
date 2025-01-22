package com.edtech.edtch.services;
import com.edtech.edtch.config.RazorpayConfig;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class PaymentService {
    
  @Autowired
  private RazorpayClient razorpayClient;

  @Autowired
  private RazorpayConfig razorpayConfig;

  public String createOrder(double amount, String currency) throws Exception {
    JSONObject orderRequest = new JSONObject();
    orderRequest.put("amount", amount * 100);
    orderRequest.put("currency", currency);
    orderRequest.put("payment_capture", 1);
    Order order = razorpayClient.orders.create(orderRequest);
    return order.toString();
  }

  public boolean verifyPayment(String orderId, String paymentId, String razorpaySignature) {
    String payload = orderId + '|' + paymentId;
    try {
      return Utils.verifySignature(payload, razorpaySignature, razorpayConfig.getSecret());
    } catch (Exception e) {
      e.printStackTrace();
      return false;
    }
  }
}