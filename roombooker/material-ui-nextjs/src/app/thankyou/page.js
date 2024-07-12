'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import greenTick from '../../public/green-tick.png'; // Update with the correct path

const ThankYouPage = () => {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [reservationDetails, setReservationDetails] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      const response = await fetch('/api/get-booking');
      if (response.ok) {
        const data = await response.json();
        setBookingDetails(data.bookingDetails);
      } else {
        console.error('Failed to fetch booking details');
      }
    };

    fetchBookingDetails();

    // Retrieve reservation details from localStorage
    const storedReservationDetails = JSON.parse(localStorage.getItem('reservationDetails'));
    setReservationDetails(storedReservationDetails);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (!bookingDetails) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ mt: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h3" component="div" gutterBottom>
        Payment Success
      </Typography>
      <Image src={greenTick} alt="Success" width={50} height={50} />
      <Typography variant="h4" component="div" gutterBottom>
        Thank You For Your Booking!
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        YOUR BOOKING HAS BEEN RECEIVED
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mt: 3, maxWidth: '600px', width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1"><strong>Reservation ID:</strong></Typography>
            <Typography variant="body2">{reservationDetails.reservationId}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1"><strong>Payment Date:</strong></Typography>
            <Typography variant="body2">{formatDate(reservationDetails.paymentDate)}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1"><strong>Mode of Payment:</strong></Typography>
            <Typography variant="body2">Credit Card</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1"><strong>Transaction Status:</strong></Typography>
            <Typography variant="body2">Success</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1"><strong>Customer Name:</strong></Typography>
            <Typography variant="body2">{bookingDetails.firstName} {bookingDetails.lastName}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1"><strong>Mobile No:</strong></Typography>
            <Typography variant="body2">{bookingDetails.phone}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1"><strong>Package:</strong></Typography>
            <Typography variant="body2">{bookingDetails.roomName}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1"><strong>Payment Amount:</strong></Typography>
            <Typography variant="body2">${bookingDetails.totalPrice}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1"><strong>Check In Date:</strong></Typography>
            <Typography variant="body2">{bookingDetails.checkInDate}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1"><strong>Check Out Date:</strong></Typography>
            <Typography variant="body2">{bookingDetails.checkOutDate}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button variant="contained" color="primary" onClick={() => router.push('/')}>
                Back to Home
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ThankYouPage;
