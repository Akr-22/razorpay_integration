// src/components/RazorpayPayment.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RazorpayPayment = () => {
  const [loading, setLoading] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const fetchRazorpayKey = async () => {
      try {
        const response = await axios.post('http://localhost:5000/get-razorpay-key');
        setRazorpayKey(response.data.key);
      } catch (error) {
        console.error('Error fetching Razorpay key:', error);
      }
    };
    
    fetchRazorpayKey();
  }, []);

  const createOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/create-order', {
        packageId: '6613d6fbbf1afca9aa1b519e',
        pricingId: '662caa2d50bf43b5cef75232',
        finalAmount: 441,
        couponCode: 'NEET25',
      });
      setOrderId(response.data.id);
      return response.data.id;
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    const orderId = await createOrder();

    const options = {
      key: razorpayKey,
      amount: '44100', 
      currency: 'INR',
      name: 'TestBuddy',
      order_id: orderId,
      handler: async function (response) {
        verifyOrder(response.razorpay_payment_id, response.razorpay_signature);
      },
      prefill: {
        name: 'Customer Name',
        email: 'email@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Customer Address',
      },
      theme: {
        color: '#F37254',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const verifyOrder = async (razorpayPaymentId, razorpaySignature) => {
    try {
      const response = await axios.post('http://localhost:5000/verify-order', {
        transactionId: orderId,
        razorpayPaymentId,
        razorpaySignature,
      });
      alert('Order verified successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error verifying order:', error);
    }
  };

  return (
    <div className="payment-container">
      <h2>Razorpay Payment Gateway</h2>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default RazorpayPayment;
