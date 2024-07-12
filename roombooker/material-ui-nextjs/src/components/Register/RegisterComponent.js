"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";
import { Divider } from "@mui/material";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import LinearProgress from "@mui/material/LinearProgress";
import { create_user } from "@/repository/用户Repo";

const smallFontSize = 9;
const medFontSize = 12;
const redcolor = "#F00";
const greencolor = "#0F0";

export default function RegisterComponent({ onClose }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cfmPassword, setCfmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [msgColor, setMsgColor] = useState(redcolor);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleCreateUser = async () => {
    if (password !== cfmPassword) {
      setMessage("Ensure both passwords are the same");
      setMsgColor(redcolor);
      return;
    }

    if (passwordStrength < 100) {
      setMessage("Password must meet the complexity requirements");
      setMsgColor(redcolor);
      return;
    }

    const newUser = { username, email, password, firstname, lastname, phone };
    const response = await create_user(newUser);
//    setMessage("Unable to register account.");
//    setMsgColor(redcolor);
    if (response.success) {
      sessionStorage.setItem("email", response.data.email);
      sessionStorage.setItem("otp_purpose", response.data.otp_purpose);
      setMessage("Check your email for verification link.");
      setMsgColor(greencolor);
    }
    else {
    console.error("Registration Error: ", response.errors);  // Log the error details
    setMessage(response.errors.message || "Unable to register account.");
    setMsgColor(redcolor);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 12) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    setPasswordStrength((strength / 5) * 100);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    calculatePasswordStrength(newPassword);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 300,
        textAlign: "center",
        zIndex: 10,
      }}
    >
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Sign up
          <CloseIcon
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              cursor: "pointer",
            }}
            onClick={onClose}
          />
        </Typography>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="first-name"
                label="First Name"
                name="first-name"
                autoComplete="given-name"
                InputLabelProps={{
                  style: { fontSize: medFontSize },
                }}
                inputProps={{
                  style: { fontSize: medFontSize },
                }}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="last-name"
                label="Last Name"
                name="last-name"
                autoComplete="family-name"
                InputLabelProps={{
                  style: { fontSize: medFontSize },
                }}
                inputProps={{
                  style: { fontSize: medFontSize },
                }}
                onChange={(e) => setLastname(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                InputLabelProps={{
                  style: { fontSize: medFontSize },
                }}
                inputProps={{
                  style: { fontSize: medFontSize },
                }}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                InputLabelProps={{
                  style: { fontSize: medFontSize },
                }}
                inputProps={{
                  style: { fontSize: medFontSize },
                }}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="phone"
                label="Phone"
                name="phone"
                autoComplete="tel"
                InputLabelProps={{
                  style: { fontSize: medFontSize },
                }}
                inputProps={{
                  style: { fontSize: medFontSize },
                }}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                InputLabelProps={{
                  style: { fontSize: medFontSize },
                }}
                inputProps={{
                  style: { fontSize: medFontSize },
                }}
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="cfmPassword"
                label="Confirm Password"
                type="password"
                id="cfmPassword"
                autoComplete="new-password"
                InputLabelProps={{
                  style: { fontSize: medFontSize },
                }}
                inputProps={{
                  style: { fontSize: medFontSize },
                }}
                onChange={(e) => setCfmPassword(e.target.value)}
              />
              <Typography variant="body2" color={msgColor}>
                {message}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ width: "100%", mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 5,
                      backgroundColor: passwordStrength > 50 ? "#0F0" : "#F00",
                    },
                  }}
                />
                <Typography variant="body2" color="textSecondary">
                  Password Strength: {passwordStrength}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{
                  width: "100%",
                  marginTop: "12px",
                  fontSize: medFontSize,
                  color: "white",
                  backgroundColor: "#C1752E",
                  "&:hover": {
                    backgroundColor: "#DC8839",
                  },
                }}
                onClick={handleCreateUser}
              >
                Create Account
              </Button>
            </Grid>
          </Grid>
        </form>
        <Typography
          variant="body1"
          sx={{
            fontSize: smallFontSize,
            padding: "5px",
            paddingBottom: "20px",
            color: "#026abb",
          }}
        >
          <Link href="/forgotpassword" color="secondary" component={NextLink}>
            Forgotten password?
          </Link>
        </Typography>
        <Divider orientation="horizontal"></Divider>
        <Button
          variant="contained"
          sx={{
            marginTop: "12px",
            fontSize: smallFontSize,
            color: "white",
            backgroundColor: "black",
            "&:hover": {
              backgroundColor: "#130b04",
            },
          }}
          onClick={onClose}
        >
          Sign in
        </Button>
      </Paper>
    </Box>
  );
}