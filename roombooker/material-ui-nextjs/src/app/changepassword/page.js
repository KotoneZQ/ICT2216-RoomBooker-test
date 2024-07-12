"use client";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import { change_password } from "@/repository/用户Repo";

const smallFontSize = 9;
const medFontSize = 12;

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [cfmPassword, setCfmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [msgColor, setMsgColor] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    if (password !== cfmPassword) {
      setMessage("Ensure both passwords are the same");
      setMsgColor("#F00");
      return;
    }

    if (passwordStrength < 100) {
      setMessage("Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
      setMsgColor("#F00");
      return;
    }

    const temp_data = {
      email: sessionStorage.getItem("email"),
      password: cfmPassword,
    };

    console.log("Calling reset_password with data:", temp_data);

    try {
      const response = await change_password(temp_data);
      console.log("Response from reset_password:", response);

      if (response.success == 200) {
        setMsgColor("#0F0"); // Set color to green for success
        setMessage("Password reset successfully");
        setTimeout(() => {
          window.location.href = "/landing";
        }, 2000); // Redirect after 2 seconds to allow the user to see the message
      } else {
        setMessage(response.message || "An error occurred");
        setMsgColor("#F00"); // Set color to red for error
      }
    } catch (error) {
      console.error("Error in reset_password:", error);
      setMessage("Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character. Please try again.");
      setMsgColor("#F00"); // Set color to red for error
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("email") == null) {
      window.location.href = "/landing";
    }
  }, []);

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
    <div>
      <Box
        maxWidth="100vw"
        sx={{
          width: "100%",
          backgroundColor: "#FFF",
        }}
      >
        <Box
          maxWidth="100vw"
          sx={{
            width: "100%",
            height: "30vh",
            backgroundColor: "#F5f5dc",
          }}
        ></Box>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            textAlign: "center",
          }}
        >
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Reset Password
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type="password" // Masking password
                    autoComplete="new-password"
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
                    id="cfmPassword"
                    label="Confirm Password"
                    name="cfmPassword"
                    type="password" // Masking password
                    autoComplete="new-password"
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
                    type="submit"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Box>
      </Box>
    </div>
  );
};

export default ChangePassword;