"use client";

import { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
// import dynamic from "next/dynamic";
import Image from "next/image";
import zxcvbn from "zxcvbn";

// Dynamically import the Scene component
// const Scene = dynamic(() => import("@/src/components/Scene"), {
//   ssr: false,
// });

export default function LoginPage() {
  const [roll, setRoll] = useState("");
  const [password, setPassword] = useState("");
  const strength = zxcvbn(password);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (strength.score < 2) {
      alert("Password is too weak. Please enter a stronger password.");
      return;
    }

    console.log("Logging in:", { roll, password });
    // proceed with login submission (API call etc.)
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: 4,
        bgcolor: "background.default",
        color: "text.primary",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Title */}
      <Typography
        variant="h3"
        component="h1"
        fontWeight="bold"
        textAlign="center"
        mt={10}
        mb={4}
        sx={{ userSelect: "none" }}
      >
        Training and Placement Cell NIT Manipur
      </Typography>

      {/* Main content */}
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        flexGrow={1}
        width="100%"
        mt={-10}
      >
        {/* 3D Rotating Cube or Logo */}
        <Box height="50vh" width="30vh" mr={-10} ml={-10} mt={20}>
          {/* Uncomment if you want the 3D scene */}
          {/* <Scene cubeSize={[2, 2, 2]} /> */}

          <Image
            src="/logo.png"
            alt="Logo"
            width={300}
            height={300}
            style={{
              filter: "drop-shadow(0 0 8px white)",
            }}
          />
        </Box>
        <Box display="flex" alignItems="center" mr={10}>
          <Box
            sx={{
              height: "500px",
              width: "2px",
              backgroundColor: "white",
              boxShadow: "0 0 8px 2px rgba(255, 255, 255, 0.45)",
              borderRadius: 1,
              mx: 20,
            }}
          />
        </Box>

        {/* Login Form */}
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          maxWidth={400}
          width="100%"
          justifyContent="center"
        >
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>

          <Box
            component="form"
            onSubmit={handleLogin}
            display="flex"
            flexDirection="column"
            gap={2}
            sx={{
              boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.7)",
              borderRadius: 2,
              padding: 2,
            }}
          >
            <TextField
              label="Roll Number"
              fullWidth
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              required
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText={
                password
                  ? `Strength: ${
                      ["Too Weak", "Weak", "Fair", "Good", "Strong"][
                        strength.score
                      ]
                    }`
                  : ""
              }
              required
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                mt: 1,
                backgroundColor: "#388e3c",
                color: "white",
                "&:hover": {
                  backgroundColor: "#2e7031",
                },
              }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
