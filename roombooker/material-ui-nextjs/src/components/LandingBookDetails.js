"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Divider from "@mui/material/Divider";
import { Button } from "@mui/material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import dayjs from "dayjs";
import useMediaQuery from "@mui/material/useMediaQuery";
import LoginComponent from "./Login/LoginComponent";
import { useAuth } from "@/AuthContext";

export default function LandingBookDetails() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:460px)");
  const { user } = useAuth();
  const smallFontSize = 14;
  const medFontSize = 12;
  const lgFontSize = 16;
  const grayColor = "#6B728E";
  const beigeColor = "#EEC78C";

  // Start calendar
  const [showCalendarStart, setShowCalendarStart] = React.useState(false);
  const [selectedStartDate, setStartDate] = React.useState(
    dayjs().format("DD/MM/YYYY")
  );
  const [highlightedDateStart, setHighlightedDateStart] = React.useState(
    dayjs()
  );

  const handleIconClickStartCal = () => {
    setShowCalendarStart(!showCalendarStart);
    setShowCalendarEnd(false);
  };

  const handleDateChangeStart = (newDate) => {
    setStartDate(newDate.format("DD/MM/YYYY"));
    setHighlightedDateStart(newDate);
    setShowCalendarStart(false);
  };

  // End calendar
  const [showCalendarEnd, setShowCalendarEnd] = React.useState(false);
  const [selectedEndDate, setEndDate] = React.useState(
    dayjs().format("DD/MM/YYYY")
  );
  const [highlightedDateEnd, setHighlightedDateEnd] = React.useState(dayjs());

  const handleIconClickEndCal = () => {
    setShowCalendarEnd(!showCalendarEnd);
    setShowCalendarStart(false);
  };

  const handleDateChangeEnd = (newDate) => {
    setEndDate(newDate.format("DD/MM/YYYY"));
    setHighlightedDateEnd(newDate);
    setShowCalendarEnd(false);
  };

  // Close calendar when clicking outside
  const handleClickOutside = (event) => {
    if (!event.target.closest(".calendar-container")) {
      setShowCalendarStart(false);
      setShowCalendarEnd(false);
    }
  };

  // Num of Pax
  const [numberOfPax, setNumOfPax] = React.useState(2);
  const handleNumOfPaxChange = (e) => {
    setNumOfPax(e.target.value);
  };

  const [showLoginComponent, setLoginComponent] = React.useState(false);
  const loginRef = React.useRef();
  const [showRegisterComponent, setRegisterComponent] = React.useState(false);
  const registerRef = React.useRef();

  const handleLoginComponent = () => {
    if (user != null && user.user_id != null) {
      router.push("/rooms");
    } else {
      setLoginComponent(!showLoginComponent);
    }
  };

  const handleRegisterComponent = () => {
    setRegisterComponent(!showRegisterComponent);
    setLoginComponent(false); // Ensure login component is closed
  };

  // Close login component when clicking outside
  const handleLoginClickOutside = (event) => {
    if (loginRef.current && !loginRef.current.contains(event.target)) {
      setLoginComponent(false);
    }
  };

  // Close register component when clicking outside
  const handleRegisterClickOutside = (event) => {
    if (registerRef.current && !registerRef.current.contains(event.target)) {
      setRegisterComponent(false);
    }
  };

  React.useEffect(() => {
    if (showCalendarStart || showCalendarEnd) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showCalendarStart, showCalendarEnd]);

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

  React.useEffect(() => {
    if (showRegisterComponent) {
      document.addEventListener("click", handleRegisterClickOutside);
    } else {
      document.removeEventListener("click", handleRegisterClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleRegisterClickOutside);
    };
  }, [showRegisterComponent]);

  return (
    <Box
      position="absolute"
      top={20}
      left={isMobile ? 0 : 68}
      width="50vw"
      height="17dvh"
      bgcolor="#F5F5F5"
      zIndex={1}
      p={isMobile ? 2 : 0}
      marginLeft="5%"
      marginRight="5%"
      marginTop="50vh"
      sx={{
        "@media (max-width: 460px)": {
          // left: "0px",
          top: "-100px",
          width: "90%",
          height: "500px",
          marginTop: "35vh",
        },
      }}
    >
      <Grid
        container
        spacing={0}
        direction="row"
        justifyContent="space-evenly"
        height={isMobile ? "30%" : "80%"}
        marginTop={2}
      >
        {/* Start Date */}
        <Grid item xs={12} sm={12} lg={2.5} height="100%">
          <Typography
            variant="body1"
            color={grayColor}
            sx={{
              marginTop: "16px",
            }}
          >
            Check in
          </Typography>
          <Box position="relative">
            <Typography
              variant="body1"
              sx={{
                marginTop: "16px",
              }}
              fontSize={isMobile ? lgFontSize : medFontSize}
              bgcolor={beigeColor}
              padding={1}
            >
              {selectedStartDate}
              <DateRangeIcon
                onClick={handleIconClickStartCal}
                sx={{
                  position: "relative",
                  top: 5,
                  left: 60,
                  zIndex: showCalendarEnd ? 2 : 1,
                  "@media (max-width: 460px)": {
                    top: 5,
                    left: 160,
                    fontSize: 35,
                    marginLeft: -1,
                  },
                }}
              />
            </Typography>
            {showCalendarStart && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  className="calendar-container"
                  style={{
                    position: "absolute",
                    top: isMobile ? 50 : -350,
                    left: isMobile ? 0 : -10,
                    width: isMobile ? "100%" : "150%",
                    zIndex: 4,
                    bgcolor: "#fff",
                    color: "black",
                    height: 300,
                  }}
                  onChange={handleDateChangeStart}
                  minDate={dayjs()}
                  value={highlightedDateStart}
                />
              </LocalizationProvider>
            )}
          </Box>
        </Grid>
        <Divider
          orientation={isMobile ? "horizontal" : "vertical"}
          variant="middle"
          flexItem
        />
        {/* End Date */}
        <Grid item xs={12} sm={12} lg={2.5} height="100%">
          <Typography
            variant="body1"
            color={grayColor}
            sx={{
              marginTop: isMobile ? "30px" : "16px",
            }}
          >
            Check out
          </Typography>
          <Box position="relative">
            <Typography
              variant="body1"
              sx={{
                marginTop: "16px",
              }}
              fontSize={isMobile ? lgFontSize : medFontSize}
              bgcolor={beigeColor}
              padding={1}
            >
              {selectedEndDate}
              <DateRangeIcon
                onClick={handleIconClickEndCal}
                sx={{
                  position: "relative",
                  top: 5,
                  left: 60,
                  zIndex: showCalendarEnd ? 2 : 1,
                  "@media (max-width: 460px)": {
                    top: 5,
                    left: 160,
                    fontSize: 35,
                    marginLeft: -1,
                  },
                }}
              />
            </Typography>
            {showCalendarEnd && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  className="calendar-container"
                  style={{
                    position: "absolute",
                    top: isMobile ? 50 : -350,
                    left: isMobile ? 0 : 0,
                    width: isMobile ? "100%" : "150%",
                    zIndex: 4,
                    bgcolor: "white",
                    color: "black",
                    height: 300,
                  }}
                  onChange={handleDateChangeEnd}
                  minDate={dayjs()}
                  value={highlightedDateEnd}
                />
              </LocalizationProvider>
            )}
          </Box>
        </Grid>
        <Divider
          orientation={isMobile ? "horizontal" : "vertical"}
          variant="middle"
          flexItem
        />
        {/* Number of Pax */}
        <Grid item xs={12} sm={12} lg={2.5} zIndex={0} height="100%">
          <Typography
            variant="body1"
            color={grayColor}
            sx={{
              marginTop: isMobile ? "50px" : "16px",
            }}
          >
            Number of person
          </Typography>
          <br />
          <TextField
            id="standard-basic"
            label=""
            variant="standard"
            bgcolor="#000"
            inputProps={{
              style: {
                fontSize: lgFontSize,
                outline: "none",
              },
            }}
            sx={{
              "& .MuiInputBase-root": {
                top: -8,
                height: 10,
                width: isMobile ? "83vw" : "100%",
                padding: 2,
                paddingTop: 3,
                paddingBottom: 3,
                bgcolor: beigeColor,
              },
            }}
            size="small"
            padding="10px"
            value={numberOfPax}
            onChange={handleNumOfPaxChange}
          />
        </Grid>
        <Divider orientation="vertical" variant="middle" flexItem />
        {/* Button */}
        <Grid item xs={12} sm={2.5} md={2.5} zIndex={0} height="100%">
          <Button
            variant="contained"
            size="small"
            sx={{
              marginTop: "20px",
              height: "60%",
              width: "100%",
              fontSize: medFontSize,
              color: "white",
              bgcolor: "#C1752E",
              "&:hover": {
                bgcolor: "#DC8839",
              },
              "@media (max-width: 460px)": {
                marginTop: "40px",
              },
            }}
            onClick={handleLoginComponent}
          >
            Locate Room
          </Button>
        </Grid>
      </Grid>
      {showLoginComponent && (
        // <LoginComponent onClose={handleLoginComponent} />
        // <div ref={loginRef}>
        <LoginComponent onClose={handleLoginComponent} />
        // </div>
      )}
      {showRegisterComponent && (
        // <div ref={registerRef}>
        <RegisterComponent onClose={handleRegisterComponent} />
        // </div>
      )}
    </Box>
  );
}
