"use client";
import * as React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useAuth } from "@/AuthContext";
import { toggle_2fa } from "@/repository/用户Repo";
import { retrieve_profile } from "@/repository/用户Repo";
import { update_profile } from "@/repository/用户Repo";
const smallFontSize = 9;
const medFontSize = 12;
const redcolor = "#F00";
const greencolor = "#0F0";

export default function ProfileComponent() {
  const { user, updateUsername } = useAuth();
  const [login_req_2fa, setLoginReq2FA] = React.useState(0);
  const [cur_user, setCurUser] = React.useState(null);

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [twofa_status, set2FAStatus] = React.useState("Disabled");
  const [buttonClicked, setButtonClicked] = React.useState(false);

  // Attached to toggle button
  const toggle2FAButton = () => {
    setButtonClicked(true);
    setLoginReq2FA(!login_req_2fa);
  };

  React.useEffect(() => {
    if (user != {}) {
      console.log("User is haha : " + JSON.stringify(user));
      retrieveUserDetails();
    }
  }, [user]);

  React.useEffect(() => {
    if (cur_user != null) {
      setEmail(cur_user.email);
      setUsername(cur_user.username);
      setFirstname(cur_user.firstname);
      setLastname(cur_user.lastname);
      setPhone(cur_user.phone);
      setLoginReq2FA(cur_user.login_req_2fa);
      set2FAStatus(cur_user.login_req_2fa ? "Enabled" : "Disabled");
    }
  }, [cur_user]);

  React.useEffect(() => {
    if (buttonClicked) {
      handleToggle2FA();
      setButtonClicked(false);
    }
  }, [login_req_2fa]);

  const retrieveUserDetails = async () => {
    try {
      if (user.user_id != null) {
        const response = await retrieve_profile(String(user.user_id));
        setCurUser(response);
      }
    } catch (error) {
      console.log(error);
      console.error("Failed to retrieve user details.");
      alert("Failed to retrieve user details.");
    }
  };

  const handleToggle2FA = async () => {
    if (cur_user) {
      const toggleEnable2FA = { email, login_req_2fa };

      try {
        console.log(toggleEnable2FA);
        const response = await toggle_2fa(toggleEnable2FA);

        if (response.success == "200") {
          alert("2FA " + response.message);
          set2FAStatus(response.message);
        } else {
          alert("Failed to update 2FA settings.");
        }
      } catch (error) {
        console.error("Error.", error);
        alert("Failed to update 2FA settings.");
      }
    }
  };
  const handleUpdateChanges = async () => {
    const userPayload = {
      email: email,
      username: username,
      firstname: firstname,
      lastname: lastname,
      phone: phone,
    };

    try {
      const response = await update_profile(userPayload);

      if (response.success == "200") {
        alert("User detail update success.");
        updateUsername(username);
      } else {
        alert("Failed to update user details.");
      }
      window.location.href = response.route;
    } catch (error) {
      console.log(error);
      console.error("Failed to update user details.");
      alert("Failed to update user details.");
    }
  };
  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: "auto" }}>
      <TextField
        fullWidth
        label="Email"
        value={email}
        margin="normal"
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        fullWidth
        label="Username"
        value={username}
        margin="normal"
        // InputProps={{
        //   readOnly: true,
        // }}
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        fullWidth
        label="First Name"
        value={firstname}
        margin="normal"
        // InputProps={{
        //   readOnly: true,
        // }}
        onChange={(e) => setFirstname(e.target.value)}
      />
      <TextField
        fullWidth
        label="Last Name"
        value={lastname}
        margin="normal"
        // InputProps={{
        //   readOnly: true,
        // }}
        onChange={(e) => setLastname(e.target.value)}
      />
      <TextField
        fullWidth
        label="Phone"
        value={phone}
        margin="normal"
        // InputProps={{
        //   readOnly: true,
        // }}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={toggle2FAButton}
          sx={{ marginBottom: 2, width: "100%" }}
        >
          2FA Status: {twofa_status}
        </Button>
        <Button
          variant="contained"
          color="primary"
          component="a"
          href="/changepassword"
          sx={{ marginBottom: 2, width: "100%" }}
        >
          Change Password
        </Button>
        <Button
          variant="contained"
          sx={{
            width: "50%",
            backgroundColor: "#C1752E", // Change background color here
            "&:hover": {
              backgroundColor: "#DC8839", // Change background color on hover
            },
          }}
          onClick={handleUpdateChanges}
        >
          Update Changes
        </Button>
      </Box>
    </Box>
  );
}
