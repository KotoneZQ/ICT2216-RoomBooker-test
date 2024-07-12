// "use client";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import CloseIcon from "@mui/icons-material/Close";
// import { Divider } from "@mui/material";
// import Link from "@mui/material/Link";
// import NextLink from "next/link";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { verify_link } from "@/repository/用户Repo";
// const smallFontSize = 9;
// const medFontSize = 12;

// const VerifyAcc = () => {
//   const { cur_email, v_link } = useParams();
//   const [message, setMessage] = useState("verifying...");
//   const [msg_color, setMsgColor] = useState("");

//   const handleSubmit = async () => {
//     const temp_data = {
//       email: cur_email,
//       get_verify_link: v_link,
//     };
//     console.log(cur_email);
//     console.log(v_link);
//     try {
//       const response = await verify_link(temp_data);
//       console.log(response);

//       setMessage(response["message"]);
//       setMsgColor("#F00");

//       if (response["success"] == 200) {
//         setMsgColor("#0F0");
//         window.location.href = response["route"];
//       }
//       // if (data.success) {
//       //   setMessage("Password reset link has been sent to your email.");
//       // } else {
//       //   setMessage("Failed to send password reset link.");
//       // }
//     } catch (error) {
//       setMessage("An error occurred. Please try again." + error);
//       setMsgColor("#F00");
//     }
//   };

//   //
//   useEffect(() => {
//     // if (sessionStorage.getItem("email") == null) {
//     //   window.location.href = "/landing";
//     // }
//     handleSubmit();
//   }, []); //

//   return (
//     <div>
//       <Box
//         maxWidth="100vw"
//         sx={{
//           width: "100%",
//           height: "100vh",
//           backgroundColor: "#FFF",
//         }}
//       >
//         <Box
//           maxWidth="100vw"
//           sx={{
//             width: "100%",
//             height: "30vh",
//             backgroundColor: "#F5f5dc",
//           }}
//         ></Box>

//         <Box
//           sx={{
//             position: "fixed",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 300,
//             textAlign: "center",
//           }}
//         >
//           <Paper elevation={3} sx={{ padding: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Account Verification
//             </Typography>
//             <Typography variant="body2" color={msg_color}>
//               {message}
//             </Typography>
//           </Paper>
//         </Box>
//       </Box>
//     </div>
//   );
// };

// export default VerifyAcc;

import React from "react";
import Link from "next/link";

const VerifyAccPage = () => {
  return (
    <div>
      <h1>Account Verification</h1>
      <p>
        It looks like you have navigated to the verification section without the
        required information.
      </p>
      <p>
        Please make sure you follow the verification link sent to your email.
      </p>
      <Link href="/landing">Go back to Home</Link>
    </div>
  );
};

export default VerifyAccPage;
