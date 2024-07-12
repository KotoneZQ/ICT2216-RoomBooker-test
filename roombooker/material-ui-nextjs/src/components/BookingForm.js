"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRoomPrice } from '@/repository/RoomRepo';
import { retrieve_profile } from '@/repository/用户Repo';
import { useAuth } from '@/AuthContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';

const BookingForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roomCount: '',
    roomId: '',
    roomName: '',
    checkInDate: '',
    checkOutDate: '',
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const storedRoomType = localStorage.getItem('roomType');
    if (storedRoomType) {
      const roomType = JSON.parse(storedRoomType);
      setFormData((prevData) => ({
        ...prevData,
        roomId: roomType.value,
        roomName: roomType.label,
      }));
    }
    if (user && user.user_id) {
      fetchUserDetails(user.user_id);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserDetails = async (userId) => {
    try {
      setLoading(true);
      const userDetails = await retrieve_profile(userId);
      setFormData((prevData) => ({
        ...prevData,
        firstName: userDetails.firstname,
        lastName: userDetails.lastname,
        email: userDetails.email,
        phone: userDetails.phone
      }));
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate dates
    const today = new Date();
    const checkInDate = new Date(formData.checkInDate);
    const checkOutDate = new Date(formData.checkOutDate);

    if (checkInDate <= today) {
      setError('Check-in date must be at least one day after today.');
      return;
    }

    if (checkOutDate <= checkInDate) {
      setError('Check-out date must be later than check-in date.');
      return;
    }

    try {
      // Fetch the room price from the backend
      const roomPriceResponse = await getRoomPrice(formData.roomId);
      const roomPrice = roomPriceResponse.price;

      // Calculate the number of days between check-in and check-out
      const timeDifference = checkOutDate - checkInDate;
      const daysDifference = timeDifference / (1000 * 3600 * 24);

      // Calculate the total price
      const roomCount = parseInt(formData.roomCount);
      const total = roomPrice * roomCount * daysDifference;

      // Update the total price state
      setTotalPrice(total);

      // Include the total price in the form data
      const updatedFormData = { ...formData, totalPrice: total };

      // Submit the booking details
      const saveBookingResponse = await fetch('/api/save-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (saveBookingResponse.ok) {
        // Redirect to the payment page
        router.push('/payment');
      } else {
        console.error('Failed to save booking details');
      }
    } catch (error) {
      console.error('Error calculating total price or saving booking details:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '100%' },
        mt: 2,
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" component="div" gutterBottom>
          Room Booking Form
        </Typography>
      </Box>
      {error && (
        <Box sx={{ textAlign: 'center', color: 'red', mb: 2 }}>
          <Typography variant="body1">{error}</Typography>
        </Box>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="phone"
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Room Count</InputLabel>
            <Select
              required
              name="roomCount"
              value={formData.roomCount}
              onChange={handleChange}
              label="Room Count"
              inputProps={{ style: { textAlign: 'center' } }} // Center align text
            >
              {[1, 2, 3, 4].map((number) => (
                <MenuItem key={number} value={number}>
                  {number} Room{number > 1 ? 's' : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="roomTypeName"
            label="Room Type"
            value={formData.roomName}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="checkInDate"
            label="Check-In Date"
            type="date"
            value={formData.checkInDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ style: { textAlign: 'center' } }} // Center align text
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="checkOutDate"
            label="Check-Out Date"
            type="date"
            value={formData.checkOutDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ style: { textAlign: 'center' } }} // Center align text
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingForm;
