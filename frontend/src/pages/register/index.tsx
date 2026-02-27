"use client";

import { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import Image from "next/image";
import zxcvbn from "zxcvbn";
import { registerUser } from "@/src/service/auth";
import Link from "next/link";
import { media } from "@/src/utils/breakpoints";

export default function RegisterPage() {
  const [roll, setRoll] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const strength = zxcvbn(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (strength.score < 2) {
      alert("Password is too weak. Please choose a stronger password.");
      return;
    }

    const payload = {
      enrollment_number: roll,
      password,
      role: 2
    };
    // console.log("111",payload);
    const result = await registerUser(payload);

    if (result.error) {
      alert(`Registration failed: ${result.error.message}`);
      return;
    }

    alert(result.message || "User registered successfully!");
    window.location.href = "/login";

    // Reset form
    setRoll("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <Box>
      <Typography
        variant="h3"
        component="h1"
        fontWeight="bold"
        textAlign="center"
        mt={"2vh"}
        mb={"-15vh"}
        sx={{
          ml: "0vh",
          fontSize: "30px",
          width: "100vh",
          display: "none", // hide by default
          [media.st]: {
            display: "block",
            fontSize: "40px" // show only at media.st breakpoint
          },
        }}
      >
        Training and Placement Cell NIT Manipur
      </Typography>

      <Box
        sx={{
          minHeight: "100vh",
          px: 4,
          bgcolor: "background.default",
          color: "text.primary",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          [media.st]: { transform: 'rotate(90deg)', color: "primary", backgroundColor: "background.default", width: "200%", alignItems: 'stretch', mb: "40px", mt: "230px" }
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          textAlign="center"
          mt={2}
          mb={4}
          sx={{
            userSelect: "none",
            [media.st]: {
              display: "none",
            },
          }}
        >
          Training and Placement Cell NIT Manipur
        </Typography>


        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          flexGrow={1}
          width="100%"
          mt={"0vh"}
        >
          <Box height="50vh" width="30vh" mr={"-20vh"} ml={0} mt={"15vh"} sx={{ [media.st]: { mb: "15vh", transform: 'rotate(270deg)' } }} >
            <Image
              src="/logo.png"
              alt="Logo"
              width={250}
              height={250}
              style={{
                filter: "drop-shadow(0 0 8px white)",

              }}
            />
          </Box>

          <Box display="flex" alignItems="center" mr={"10vh"}>
            <Box
              sx={{
                height: "80vh",
                width: "0.2vh",
                backgroundColor: "white",
                boxShadow: "0 0 8px 2px rgba(255, 255, 255, 0.45)",
                borderRadius: 1,
                mx: 30,
                mr: 10,
                [media.st]: { mb: "10vh" }
              }}
            />
          </Box>

           <Box
            display="flex"
            flexDirection="column"
            gap={2}
            maxWidth={400}
            width="100%"
            justifyContent="center"
            sx={{ [media.st]: { transform: 'rotate(270deg)', mb: "10vh", ml: "-20vh", minWidth: "60vh" ,minHeight:"90vh"} }}
          >
            <Typography variant="h4" gutterBottom>
              Register
            </Typography>

            <Box
              component="form"
              onSubmit={handleRegister}
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
                    ? `Strength: ${["Too Weak", "Weak", "Fair", "Good", "Strong"][
                    strength.score
                    ]
                    }`
                    : ""
                }
                required
              />

              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                Register
              </Button>
            </Box>
            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 1, color: "white" }}
            >
              Already Have Account?{" "}
              <Link href="/login" passHref legacyBehavior>
                <a
                  style={{
                    color: "#388e3c",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: "18px",
                  }}
                >
                  Login here
                </a>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
