'use client';

import React, { useState, useEffect } from 'react';
import { getRooms } from '@/repository/RoomRepo';
import RoomList from '@/components/RoomList';
import Image from 'next/image';
import breadcrumb from '../../public/breadcrumb.png';
import { CircularProgress, Box, Typography } from '@mui/material';

const RoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
      } catch (error) {
        console.log(error);
        setError('Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '50px', position: 'relative' }}>
        <h1>Rooms</h1>
        <Image
          src={breadcrumb}
          alt="Breadcrumb"
          width={200}
          height={200}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '200px',
            opacity: 0.2,
            zIndex: -1,
          }}
        />
      </div>
      <RoomList rooms={rooms} />
    </div>
  );
};

export default RoomPage;
