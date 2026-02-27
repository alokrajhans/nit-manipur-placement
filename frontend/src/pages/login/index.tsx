"use client";

import { useEffect, useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import Image from "next/image";
import zxcvbn from "zxcvbn";
import { loginUser } from "@/src/service/auth";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/src/components/hooks";
import { setUserDetails } from "@/src/store/userSlice";
import { media } from "@/src/utils/breakpoints";
import { Height } from "@mui/icons-material";

export default function LoginPage() {
  const [roll, setRoll] = useState("");
  const [password, setPassword] = useState("");
  const strength = zxcvbn(password);
  const dispatch = useAppDispatch();

  // Optional: read user state for debug or logic after dispatch
  const user = useAppSelector((state) => state.user);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (strength.score < 2) {
      alert("Password is too weak. Please enter a stronger password.");
      return;
    }

    try {
      const { token, error, message, role } = await loginUser({
        enrollment_number: roll,
        password,
      });

      if (error) {
        alert(`Login failed: ${error.message || message || "Unknown error"}`);
        return;
      }

      if (!token) {
        alert("Login failed: No token received.");
        return;
      }

      // Save token in localStorage
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("role", role.toString());
      localStorage.setItem("enrollment_number", roll);

      // Dispatch user details to Redux store

      // Redirect to ongoing jobs page
      window.location.href = "/ongoing-jobs";
    } catch (error: any) {
      console.error("Login error:", error);
      alert(`Login failed: ${error?.message || "Unknown error"}`);
    }
  };

  // Dispatch user details to Redux store
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("jwtToken");
    const enrollment = localStorage.getItem("enrollment_number"); // optional parsing if JWT contains it

    if (storedRole && enrollment) {
      dispatch(
        setUserDetails({
          enrollment_number: enrollment,
          role: Number(storedRole),
        })
      );
    }
  }, []);
  useEffect(() => {
    // console.log("✅ User state after dispatch:", user);
  }, [user]);
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
            fontSize:"40px" // show only at media.st breakpoint
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
                    ? `Strength: ${["Too Weak", "Weak", "Fair", "Good", "Strong"][
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

            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 1, color: "white" }}
            >
              Not registered yet?{" "}
              <Link href="/register" passHref legacyBehavior>
                <a
                  style={{
                    color: "#388e3c",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: "18px",
                  }}
                >
                  Register here
                </a>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
