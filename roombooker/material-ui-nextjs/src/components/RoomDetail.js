"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Grid, Card, CardContent, Typography, Box, List, ListItem, Button } from '@mui/material';

const RoomDetail = ({ room }) => {
  const handleBook = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('roomType', JSON.stringify({ value: room.room_id, label: room.name }));
    }
  };

  const flexContainer = {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  };

  return (
    <Grid container spacing={2} sx={{ maxWidth: '1200px', margin: 'auto', padding: '20px' }}>
      <Grid item xs={12} md={7}>
        <Card>
          <Box sx={{ width: '100%', height: '500px', position: 'relative' }}>
            <Image
              src={room.image_url}
              alt={room.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fetchpriority // Ensure the image is prioritized for loading
            />
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">{room.name}</Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ marginBottom: '10px' }}>Capacity: {room.capacity}</Typography>
              <Typography variant="body2" sx={{ marginBottom: '10px' }}>${room.price} / day</Typography>
            </Box>
            <Link href="/booking" passHref>
              <Button variant="contained" color="primary" onClick={handleBook}>Book</Button>
            </Link>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">{room.name}</Typography>
                <Typography variant="body2" color="text.secondary">Description:</Typography>
                <Typography variant="body2" sx={{ marginTop: '10px' }}>{room.description}</Typography>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" component="div">Amenities:</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 1 }}>
                        <List style={flexContainer}>
                            <ListItem sx={{ minWidth: '150px', backgroundPosition: 'left center', backgroundRepeat: 'no-repeat', paddingLeft: '25px', borderBottom: '1px solid #000' }}>Amenity 1</ListItem>
                            <ListItem sx={{ minWidth: '150px', backgroundPosition: 'left center', backgroundRepeat: 'no-repeat', paddingLeft: '25px', borderBottom: '1px solid #000' }}>Amenity 2</ListItem>
                            <ListItem sx={{ minWidth: '150px', backgroundPosition: 'left center', backgroundRepeat: 'no-repeat', paddingLeft: '25px', borderBottom: '1px solid #000' }}>Amenity 3</ListItem>
                        </List>
                    </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" component="div">Features:</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 1 }}>
                        <List style={flexContainer}>
                            <ListItem sx={{ minWidth: '150px', backgroundPosition: 'left center', backgroundRepeat: 'no-repeat', paddingLeft: '25px', borderBottom: '1px solid #000' }}>Feature 1</ListItem>
                            <ListItem sx={{ minWidth: '150px', backgroundPosition: 'left center', backgroundRepeat: 'no-repeat', paddingLeft: '25px', borderBottom: '1px solid #000' }}>Feature 2</ListItem>
                            <ListItem sx={{ minWidth: '150px', backgroundPosition: 'left center', backgroundRepeat: 'no-repeat', paddingLeft: '25px', borderBottom: '1px solid #000' }}>Feature 3</ListItem>
                        </List>
                    </Box>
                </Box>
            </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RoomDetail;
