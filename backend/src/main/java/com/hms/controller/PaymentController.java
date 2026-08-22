package com.hms.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import okhttp3.Response;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.stereotype.Controller;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/payment")
public class PaymentController {
    @Value("${RAZORPAY_KEY_ID}")
    private String keyId;

    @Value("${RAZORPAY_KEY_SECRET}")
    private String keySecret;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data){
        try{
        int amount = (int)data.get("amount");
            RazorpayClient client = new RazorpayClient(keyId,keySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount",amount * 100);
            orderRequest.put("currency","INR");
            orderRequest.put("receipt","txn_"+System.currentTimeMillis());

            Order order = client.orders.create(orderRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId",order.get("id"));
            response.put("amount",amount*100);
            response.put("currency","INR");
            response.put("keyId",keyId);
            return ResponseEntity.ok(response);
        }catch(RazorpayException e){
            return ResponseEntity.status(500).body("order creation failed: "+e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String,String> data){
            try{
                String orderId = data.get("razorpay_order_id");
                String paymentId = data.get("razorpay_payment_id");
                String signature = data.get("razorpay_signature");

                String payload  = orderId + "|" + paymentId;
                String generated = hmacSHA256(payload ,keySecret);

                if(generated.equals(signature)){
                    Map<String,String> response = new HashMap<>();
                    response.put("status","SUCCESS");
                    response.put("PaymentId",paymentId);
                    return ResponseEntity.ok(response);
                }else{
                    return ResponseEntity.status(400).body("Payment verification failed");
                }

            }catch(Exception e){
                    return ResponseEntity.status(500).body("Error"+e.getMessage());
            }
    }

    private String hmacSHA256(String data,String secret) throws Exception{
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        mac.init(secretKey);
        byte[] hash = mac.doFinal(data.getBytes());
        StringBuilder hex = new StringBuilder();
        for (byte b : hash) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }
}
