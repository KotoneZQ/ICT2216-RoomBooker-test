import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ProfileComponent from "@/components/Profile/ProfileComponent";

export default function Profile_Page() {
  return (
    <Container
      maxWidth="100vw"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5f5dc",
      }}
    >
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Profile
        </Typography>
        <ProfileComponent />
      </Box>
    </Container>
  );
}
