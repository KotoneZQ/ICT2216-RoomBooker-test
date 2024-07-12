"use client";

import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import CheckoutForm from '@/components/CheckoutForm';
import { getStripeApiKey } from '@/action/action';

const PaymentPage = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [stripeApiKey, setStripeApiKey] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch('/api/get-booking', {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          setBookingDetails(data.bookingDetails);
        } else {
          console.error('Failed to fetch booking details');
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    const fetchApiKey = async () => {
      try {
        const data = await getStripeApiKey();
        setStripeApiKey(data);
      } catch (error) {
        console.error('Error fetching Stripe API key:', error);
      }
    };

    fetchApiKey();
    fetchBookingDetails();
  }, []);

  if (!bookingDetails || !stripeApiKey) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const stripePromise = loadStripe(stripeApiKey);

  return (
    <Container>
      <Paper sx={{ p: 4, mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Confirm and Payment
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Your trip
            </Typography>
            <TextField
              label="Room Type"
              fullWidth
              variant="outlined"
              margin="normal"
              value={bookingDetails.roomName}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Price"
              fullWidth
              variant="outlined"
              margin="normal"
              value={bookingDetails.totalPrice}
              InputProps={{
                readOnly: true,
              }}
            />
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Pay with
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                Credit Card
              </Button>
            </Box>
            <Elements stripe={stripePromise}>
              <CheckoutForm bookingDetails={bookingDetails} />
            </Elements>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Booking Details
            </Typography>
            <Typography>
              The Roombooker offers unforgettable food and drink options. A
              memorable stay with delicious breakfast. Join us.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Need Any Help
              </Typography>
              <Typography>
                If you need any help to book your room, our support team is
                ready for you 24/7 days.
              </Typography>
              <Typography>Call Us: 994 1112 3456</Typography>
            </Box>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Visit Free Tour
              </Typography>
              <Typography>
                We are here for you, visit us for free. We have the best room
                in town. Roombooker is not only a room, it's a memorable
                experience.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PaymentPage;