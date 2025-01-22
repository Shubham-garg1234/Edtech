import { useEffect } from "react";

export default function usePaymentService() {
  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_ID;

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => console.log("Razorpay script loaded successfully");
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async (amount) => {
    try {
      const response = await fetch("http://localhost:8081/razorpay/v1/createOrder?amount="+amount+"&currency=INR", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`);
      }

      const order = await response.json();

      return new Promise((resolve, reject) => {
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "EduXcel",
        description: "Payment for your order",
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await fetch("http://localhost:8081/razorpay/v1/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error(`Payment verification failed: ${verifyResponse.statusText}`);
            }else {
              resolve(verifyResponse); 
            }

          } catch (err) {
            alert("Payment failed: " + err.message);
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzpay = new window.Razorpay(options);
      rzpay.open(options);
      
    }) 
    }
    catch (err) {
      console.error("Error during payment setup:", err);
      alert("Error creating order: " + err.message);
    }
    
  };

  return { handlePayment };
}
