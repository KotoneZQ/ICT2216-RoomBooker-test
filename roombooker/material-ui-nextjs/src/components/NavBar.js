"use client";

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import Logo from "../public/logo.png";
import { useAuth } from "@/AuthContext";
import LoginComponent from "./Login/LoginComponent"; // Adjust the import path as needed

const navItems = [
  { label: "HOME", path: "/" },
  { label: "ABOUT US", path: "/about" },
  { label: "ROOMS & SUITES", path: "/rooms" },
  { label: "EVENTS", path: "/events" },
  { label: "LOCATION", path: "/location" },
  { label: "CONTACT US", path: "/contact" },
];

const Navbar = () => {
  const { user, login, logout, getUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false); // Track login state
  const [showLoginComponent, setShowLoginComponent] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (user != null) {
      if (user.user_id != null) {
        setLoggedIn(true);
      }
    } else {
      console.log("User not logged in");
    }
  }, [user]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const loginRef = React.useRef();

  // Close login component when clicking outside
  const handleLoginClickOutside = (event) => {
    if (loginRef.current && !loginRef.current.contains(event.target)) {
      setShowLoginComponent(false);
    }
  };

  const handleLoginComponentOpen = () => {
    setShowLoginComponent(true);
  };

  React.useEffect(() => {
    if (showLoginComponent) {
      document.addEventListener("click", handleLoginClickOutside);
    } else {
      document.removeEventListener("click", handleLoginClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleLoginClickOutside);
    };
  }, [showLoginComponent]);

  const handleLoginComponentClose = () => {
    setShowLoginComponent(false);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    setLoggedIn(false);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    window.location.href = "/profile";
  };
  const handleReservationsClick = () => {
    handleMenuClose();
    window.location.href = "/reservations";
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          my: 2,
        }}
      >
        <img
          src={Logo.src}
          alt="Logo"
          style={{ height: "30px", marginRight: "20px" }}
        />
        <Typography variant="h6" sx={{ marginRight: 1 }}>
          ROOM BOOKER
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.label}>
            <Link href={item.path} passHref>
              <ListItemText primary={item.label} />
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#EEC78C" }}>
        <Toolbar>
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <img
                src={Logo.src}
                alt="Logo"
                style={{ height: "60px", marginRight: "20px" }}
              />
              <Box
                sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}
              >
                {navItems.map((item) => (
                  <Button key={item.label} sx={{ color: "#000000" }}>
                    <Link
                      href={item.path}
                      passHref
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </Box>
            </Box>
          )}
          {isMobile && (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </>
          )}
          {!loggedIn ? (
            <Button
              color="inherit"
              variant="contained"
              size="small"
              sx={{
                fontSize: "12px",
                color: "white", // Change text color here
                backgroundColor: "#C1752E", // Change background color here
                "&:hover": {
                  backgroundColor: "#DC8839", // Change background color on hover
                },
              }}
              onClick={handleLoginComponentOpen}
            >
              Sign in
            </Button>
          ) : (
            <Box
              sx={{
                color: "black",
              }}
            >
              <IconButton
                color="inherit"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
              >
                <AccountCircleIcon />
                <Typography variant="body1">{user.username}</Typography>
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={handleReservationsClick}>
                  Reservations
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      {showLoginComponent && (
        <LoginComponent onClose={handleLoginComponentClose} />
      )}
    </Box>
  );
};

export default Navbar;
