"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/AuthContext'; // Adjust the path to your context
import { getReservations } from '@/repository/ReservationRepo';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
} from '@mui/material';

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchReservations = async () => {
      if (user.user_id) {
        try {
            const data = await getReservations(user.user_id);
            setReservations(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
      }
    };

    fetchReservations();
  }, [user.user_id]);

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Reservation History
      </Typography>
      {reservations.length === 0 ? (
        <Typography variant="h6" align="center">
          No reservations found.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reservation ID</TableCell>
                <TableCell>Room Name</TableCell>
                <TableCell>Check-in Date</TableCell>
                <TableCell>Check-out Date</TableCell>
                <TableCell>Total Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.reservation_id}>
                  <TableCell>{reservation.reservation_id}</TableCell>
                  <TableCell>{reservation.room.name}</TableCell>
                  <TableCell>{new Date(reservation.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(reservation.end_date).toLocaleDateString()}</TableCell>
                  <TableCell>${reservation.total_price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ReservationsPage;
