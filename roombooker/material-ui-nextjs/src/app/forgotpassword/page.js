"use client";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";
import { Divider } from "@mui/material";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import { forgot_password } from "@/repository/用户Repo";

const smallFontSize = 9;
const medFontSize = 12;

const ForgotPassword = () => {
  const [message, setMessage] = useState("");
  const [msg_color, setMsgColor] = useState("");
  const [email, setEmail] = useState("");
  const [cfmEmail, setCfmEmail] = useState("");

  const handleGoToLanding = async () => {
    window.location.href = "/landing";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email != cfmEmail) {
      console.log("not same");
      setMessage("Email and Confirm Email are different.");
      setMsgColor("#F00");
      return;
    }
    const temp_data = { email };
    try {
      const response = await forgot_password(temp_data);

      console.log(response);
      setMessage(response.message);
      setMsgColor("#F00");
      if (response.success == 200) {
        setMsgColor("#0F0");
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("otp_purpose", response["otp_purpose"]);
        window.location.href = response.route;
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMsgColor("#F00");
    }
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
        {/* <Box
          sx={{
            width: "30%",
            height: "70%",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#000",
            borderRadius: "15px",
            position: "absolute",
            left: "35%",
            top: "20%",
            color: "#fff",
          }}
        >
          <Typography variant="h5" sx={{}}>
            Forgot password?
          </Typography>

        </Box> */}
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
              Forgot Password
            </Typography>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
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
                    id="email"
                    label="Confirm Email"
                    name="email"
                    autoComplete="email"
                    inputProps={{
                      style: { fontSize: medFontSize },
                    }}
                    onChange={(e) => setCfmEmail(e.target.value)}
                  />
                  <Typography variant="body2" color={msg_color}>
                    {message}
                  </Typography>
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
                    onClick={handleSubmit}
                  >
                    Send OTP
                  </Button>
                </Grid>
              </Grid>
            </form>

            <Divider
              orientation="horizontal"
              sx={{
                marginTop: "20px",
              }}
              fontSize={medFontSize}
            ></Divider>
            <Button
              variant="contained"
              sx={{
                marginTop: "12px",
                fontSize: { medFontSize },
                color: "white",
                backgroundColor: "black",
                "&:hover": {
                  backgroundColor: "#130b04",
                },
              }}
              onClick={handleGoToLanding}
            >
              &lt; Login
            </Button>
          </Paper>
        </Box>
      </Box>
    </div>
  );
};

export default ForgotPassword;