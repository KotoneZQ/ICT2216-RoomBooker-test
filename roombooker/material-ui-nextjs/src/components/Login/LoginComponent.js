"use client";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
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
import RegisterComponent from "../Register/RegisterComponent";
import { user_login } from "@/repository/用户Repo";
import { useAuth } from "@/AuthContext";

const smallFontSize = 12;
const medFontSize = 18;
const redcolor = "#F00";
const greencolor = "#0F0";
export default function LoginComponent({ onClose }) {
  const { login } = useAuth();
  const [registerAcc, toggleRegisterAcc] = useState(false);

  const loginRef = useRef();
  const registerRef = useRef();
  const handleRegisterAccState = () => {
    toggleRegisterAcc(true);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [msg_color, setMsgColor] = useState(redcolor);

const handleLoginUser = async () => {
  const temp_user = { email, password };

    try {
      const data = await user_login(temp_user); // data is already JSON

      if (data.success === "200") {
        if (data.email) {
          sessionStorage.setItem("email", data.email);
          sessionStorage.setItem("otp_purpose", data.otp_purpose);
          sessionStorage.setItem("user_id", data.user_id);
          sessionStorage.setItem("role", data.role);

          if (data.otp_purpose == "") {
            setMessage("Login success");
            setMsgColor(greencolor);
            const user_data = {
              email: data.email,
              user_id: data.user_id,
              username: data.username,
              role: data.role,
            };
            login(user_data);
          }
        }
        window.location.href = data.route;
      } else {
        console.error("Login failed:", data);
        setMessage(data.message || "Login failed");
        setMsgColor(redcolor);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Login failed");
      setMsgColor(redcolor);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLoginUser();
    }
  };

  const handleClickOutside = (event) => {
    if (registerAcc) {
      if (registerRef.current && !registerRef.current.contains(event.target)) {
        toggleRegisterAcc(false);
      }
    } else {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        onClose();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [registerAcc]);

  useEffect(() => {
    const handleRouteChange = () => {
      setLoginComponent(false);
      setShowRegisterComponent(false);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  return (
    <>
      {registerAcc ? (
        <div ref={registerRef}>
          <RegisterComponent onClose={() => toggleRegisterAcc(false)} />
        </div>
      ) : (
        <div ref={loginRef}>
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
                Sign in
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
                      id="email"
                      label="Email"
                      name="email"
                      autoComplete="email"
                      inputProps={{
                        style: { fontSize: "18px" },
                      }}
                      onChange={(e) => setEmail(e.target.value)}
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
                      autoComplete="current-password"
                      inputProps={{
                        style: { fontSize: "18px" },
                      }}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
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
                        bgcolor: "#C1752E",
                        "&:hover": {
                          bgcolor: "#DC8839",
                        },
                      }}
                      onClick={handleLoginUser}
                    >
                      Sign In
                    </Button>
                  </Grid>
                </Grid>
              </form>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { smallFontSize },
                  padding: "5px",
                  paddingBottom: "20px",
                  color: "#026abb",
                }}
              >
                <Link
                  href="/forgotpassword"
                  color="secondary"
                  component={NextLink}
                >
                  Forgotten password?
                </Link>
              </Typography>
              <Divider orientation="horizontal"></Divider>
              <Button
                variant="contained"
                sx={{
                  marginTop: "12px",
                  fontSize: { medFontSize },
                  color: "white",
                  bgcolor: "black",
                  "&:hover": {
                    bgcolor: "#130b04",
                  },
                }}
                onClick={handleRegisterAccState}
              >
                Create Account
              </Button>
            </Paper>
          </Box>
        </div>
      )}
    </>
  );
}
