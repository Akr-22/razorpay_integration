// razorpay-backend/index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

let orders = [];
let bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njk2NzZhYTFmNGQ5NzMzNmQzMTNhNjciLCJyb2xlIjoidXNlciIsImlhdCI6MTcyNDc3NTA2MCwiZXhwIjoxNzI3MzY3MDYwfQ.Ztp5h6prtVamX2MoCD7VOon4u6uSPg5MxDD42omICZA'; 


app.post('/verify-otp', async (req, res) => {
  try {
    const response = await axios.post('https://api.testbuddy.live/v1/auth/verifyotp', {
      mobile: "+919098989999",
      otp: "8899"
    });

    bearerToken = `Bearer ${response.data.token}`; 
    res.status(200).json({ token: bearerToken });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).send('Server error');
  }
});

// Get Razorpay Key
app.post('/get-razorpay-key', async (req, res) => {
  try {
    const response = await axios.post('https://api.testbuddy.live/v1/payment/key', {}, {
      headers: {
        Authorization: bearerToken,
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error getting Razorpay key:', error);
    res.status(500).send('Server error');
  }
});

// Create Order API
app.post('/create-order', async (req, res) => {
  try {
    const { packageId, pricingId, finalAmount, couponCode } = req.body;

    const response = await axios.post('https://api.testbuddy.live/v1/order/create', {
      packageId,
      pricingId,
      finalAmount,
      couponCode,
    }, {
      headers: {
        Authorization: bearerToken,
      }
    });

    const order = {
      id: response.data._id,
      amount: finalAmount,
      status: response.data.status,
    };

    orders.push(order);

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send('Server error');
  }
});

// Verify Order API
app.post('/verify-order', async (req, res) => {
  try {
    const { transactionId, razorpayPaymentId, razorpaySignature } = req.body;

    const response = await axios.post('https://api.testbuddy.live/v1/order/verify', {
      transactionId,
      razorpayPaymentId,
      razorpaySignature,
    }, {
      headers: {
        Authorization: bearerToken,
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error verifying order:', error);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
