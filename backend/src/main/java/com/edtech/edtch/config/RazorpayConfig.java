package com.edtech.edtch.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.razorpay.RazorpayClient;

@Configuration
public class RazorpayConfig {

  @Value("${razorpay.keyId}")
  private String keyId;

  @Value("${razorpay.keySecret}")
  private String keySecret;

  public String getSecret() {
      return keySecret;
  }

  @Bean
  public RazorpayClient razorpayClient() throws Exception {
    return new RazorpayClient(keyId, keySecret);
  }
}