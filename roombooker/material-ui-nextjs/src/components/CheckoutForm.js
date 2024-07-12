'use client';

import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Box, Button, TextField, Grid, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import CardInputField from './CardInputField';
import { useAuth } from '@/AuthContext';
import { verifyRoomDetails } from '@/repository/RoomRepo';
import { createPaymentIntent, updatePaymentStatus } from '@/repository/PaymentRepo';

const CheckoutForm = ({ bookingDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [cardHolderName, setCardHolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.user_id) {
      setUserId(user.user_id);
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // 1. Check if the room id and room name is correct from database
      const roomDetails = JSON.parse(localStorage.getItem('roomType'));
      if (!roomDetails) {
        throw new Error("Room details are not available in localStorage");
      }

      const { value: room_id, label: room_name } = roomDetails;

      const verifyData = await verifyRoomDetails(room_id, room_name);

      if (!verifyData.valid) {
        throw new Error("Room details do not match");
      }

      const paymentIntentParams = {
        roomId: bookingDetails.roomId,
        roomCount: bookingDetails.roomCount,
        checkInDate: bookingDetails.checkInDate,
        checkOutDate: bookingDetails.checkOutDate,
        paidAmount: bookingDetails.totalPrice,
        userId: parseInt(userId)    
      }
      // Create a payment intent on the backend
      const paymentIntentData = await createPaymentIntent(paymentIntentParams);

      const { clientSecret, reservation_id } = paymentIntentData;

      const cardElement = elements.getElement(CardElement);

      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: cardHolderName },
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        const paymentData = {
          paymentStatus: 'succeeded',
          paymentId: paymentIntent.id,
          reservationId: parseInt(reservation_id),
          totalPrice: bookingDetails.totalPrice,
          roomId: bookingDetails.roomId,
        }
        // Payment succeeded, update the backend
        const updateData = await updatePaymentStatus(paymentData);

        // Update localStorage or state with reservation ID and payment date
        localStorage.setItem('reservationDetails', JSON.stringify({
          reservationId: updateData.reservation_id,
          paymentDate: updateData.payment_date,
        }));

        // Remove the roomType item from localStorage
        // localStorage.removeItem('roomType'); // uncomment this line at the end

        router.push('/thankyou');
      }
    } catch (error) {
      setError(error.response?.data?.detail || error.message);
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5" component="div" gutterBottom>
        Payment Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            name="cardHolderName"
            label="Card Holder Name"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <CardInputField />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button variant="contained" color="primary" type="submit" disabled={!stripe || loading}>
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ color: 'white', mr: 2 }} />
                  Processing...
                </>
              ) : (
                'Pay Now'
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
      {error && (
        <Box sx={{ textAlign: 'center', color: 'red', mt: 2 }}>
          <Typography variant="body1">{error}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default CheckoutForm;
