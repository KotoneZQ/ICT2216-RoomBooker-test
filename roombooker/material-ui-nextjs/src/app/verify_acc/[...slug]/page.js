"use client";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { verify_link } from "@/repository/用户Repo";

const smallFontSize = 9;
const medFontSize = 12;

export default function VerifyAcc({ params }) {
  // console.log("Test:", decodeURIComponent(params.slug));

  // params.slug.array.forEach((element) => {
  //   console.log("haha: ", decodeURIComponent(element));
  // });

  const [message, setMessage] = useState("verifying...");
  const [msgColor, setMsgColor] = useState("");
  // const [emailPart, setEmailPart] = useState("");
  // const [vLinkPart, setVLinkPart] = useState("");
  const handleSubmit = async (emailPart, vLinkPart) => {
    // console.log("Emailpart: ", emailPart);
    // console.log("vLinkPart: ", decodeURIComponent(vLinkPart));
    console.log("emailPart: ", emailPart);
    console.log("vLinkPart: ", vLinkPart);
    const temp_data = {
      email: emailPart,
      get_verify_link: vLinkPart,
    };
    try {
      const response = await verify_link(temp_data);
      console.log(response);

      if (response["success"] == 200) {
        setMessage("Account Verified");
        setMsgColor("#0F0");
        window.location.href = response["route"];
      }
    } catch (error) {
      setMessage("An error occurred. Please try again." + error);
      setMsgColor("#F00");
    }
  };

  //
  useEffect(() => {
    // if (sessionStorage.getItem("email") == null) {
    //   window.location.href = "/landing";
    // }
    const slugString = Array.isArray(params.slug)
      ? params.slug.join(",")
      : params.slug;
    const parts = slugString.split(",");
    if (parts.length > 1) {
      const emailPart = decodeURIComponent(parts[0]);
      const vLinkPart = decodeURIComponent(parts.slice(1).join("/"));

      handleSubmit(emailPart, vLinkPart);
    } else {
      console.error("Slug format is incorrect");
    }
  }, []); //

  return (
    <div>
      <Box
        maxWidth="100vw"
        sx={{
          width: "100%",
          height: "100vh",
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
              Account Verification
            </Typography>
            <Typography variant="body2" color={msgColor}>
              {message}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </div>
  );
}
