"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";
import LandingBookDetails from "@/components/LandingBookDetails";
import { useAuth } from "@/AuthContext";
import workplace_img from "@/images/empty-workplace-office.jpg";

export default function Landing() {
  const isMobile = useMediaQuery("(max-width:460px)");
  const { user, login, logout } = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Grid
        container
        spacing={0}
        sx={{
          flexGrow: 1,
        }}
      >
        <Grid item xs={12} sm={4} zIndex={0}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "relative",
              backgroundColor: "#F5f5dc",
            }}
          >
            <Box
              position="absolute"
              top={0}
              left={80}
              width="100%"
              maxWidth="1000px"
              height="100px"
              zIndex={1}
              p={2}
              mt={25}
              sx={{
                "@media (max-width: 460px)": {
                  maxWidth: "500px",
                  marginTop: "0",
                  left: "0",
                },
              }}
            >
              <Typography variant="h3">Welcome to</Typography>
              <Typography variant="h3">RoomCrafter</Typography>
              <br />
              <br />
              <Typography variant="body2">
                Booking a room has never been so easy!
              </Typography>
            </Box>
            <LandingBookDetails />
          </Box>
        </Grid>
        {!isMobile && (
          <Grid item xs={12} sm={8} zIndex={-1}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              <Image
                src={workplace_img}
                alt="backgroundimage"
                layout="fill"
                objectFit="cover"
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
