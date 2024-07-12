// CardInputField.js
import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

const CardElementContainer = styled(Box)(({ theme }) => ({
  border: '1px solid rgba(0, 0, 0, 0.23)',
  borderRadius: '4px',
  padding: '18.5px 14px',
  marginTop: '16px',
  '&:hover': {
    borderColor: 'rgba(0, 0, 0, 0.87)',
  },
  '&.Mui-focused': {
    borderColor: theme.palette.primary.main,
    borderWidth: '2px',
  },
}));

const CardInputField = () => (
  <Box>
    <Typography variant="subtitle1" gutterBottom>
      Card Details
    </Typography>
    <CardElementContainer>
      <CardElement options={{ hidePostalCode: true }} />
    </CardElementContainer>
  </Box>
);

export default CardInputField;
