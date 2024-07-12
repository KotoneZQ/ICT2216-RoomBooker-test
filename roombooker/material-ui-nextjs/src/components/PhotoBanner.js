// components/Banner.js
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import bg from '../public/banner.jpg'

const Banner = () => {
  return (
    <Box
      sx={{
        height: '300px',
        backgroundImage: `url("${bg.src}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textShadow: '0 1px 4px rgba(0,0,0,0.6)',
      }}
    >
      <Typography variant="h4" component="div" gutterBottom>
        Lovely Luxurious Room in Singapore
      </Typography>
      <Typography variant="body1" component="div">
        YOU ARE ONE STEP AWAY FROM BOOKING
      </Typography>
    </Box>
  );
};

export default Banner;
