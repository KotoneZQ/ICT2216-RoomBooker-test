import React from 'react';
import BookingForm from '@/components/BookingForm';
import PhotoBanner from '@/components/PhotoBanner';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

const BookingPage = () => {
  return (
    <div>
      <PhotoBanner />
        <Container>
          <Box sx={{ my: 4 }}>
            <BookingForm />
          </Box>
        </Container>
    </div>
  );
};

export default BookingPage;