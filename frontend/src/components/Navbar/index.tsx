"use client";

import React, { useCallback, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Container,
} from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import apiClient from "@/src/utils/apiClient";
import Link from "next/link";
import { media } from "@/src/utils/breakpoints";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import LogoutIcon from "@mui/icons-material/Logout";

const Navbar = () => {
  const isMobile = useMediaQuery("(max-width:460px)");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("persist:root");
    localStorage.removeItem("enrollment_number");
    localStorage.removeItem("role");
    router.push("/login");
  }, [router]);

  const Logo = () => (
    <Box ml={-1} mt={1} mr={1} sx={{ [media.st]: { ml: -1, mt: 0.5 } }}>
      <Link href="/" passHref>
        <Image
          src="/logo.png"
          alt="Logo"
          width={isMobile ? 25 : 40}
          height={isMobile ? 25 : 40}
          style={{ cursor: "pointer", filter: "drop-shadow(0 0 2px white)" }}
        />
      </Link>
    </Box>
  );

  const navItems = [
    { label: "Companies", path: "/ongoing-jobs" },
    { label: "Companies Visited", path: "/companies-visited" },
    { label: "Selected Students", path: "/selected-students" },
    { label: "Analytics", path: "/analytics" },
    { label: "Coordinator List", path: "/coordinatorList" },
    { label: "Applied Jobs", path: "/applied-jobs" },
    { label: "My Profile", path: "/myProfile" },
  ];

  const handleProtectedNavigation = async (path: string) => {
    try {
      await apiClient.get("/me");
      router.push(path);
    } catch (error) {
      console.warn("User not authenticated:", error);
      router.push("/login");
    }
  };

  return (
    <>
      {/* // <AppBar position="static" color="primary" sx={{ bgcolor: "background.default", width: '100%' }}> */}
      {/* <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}> */}
      {isMobile ? (
        <>
          <Box
            sx={{
              mt: "20px",
              display: "flex",
              alignItems: "stretch",
              justifyContent: "space-between",
              width: "90vw",      // ensures full viewport width
              px: 2,
            }}
          >
            {/* Menu Button */}
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
              {Boolean(anchorEl) ? <CloseIcon /> : <MenuIcon />}

            </IconButton>

            {/* Menu Dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: "black", // dark background
                  color: "white",           // text color
                  borderRadius: 2,
                  mt: 1,
                  width: "50vw",              // better for mobile
                  maxWidth: 300,
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
                },
              }}
              transformOrigin={{ horizontal: 'center', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            >
              {navItems.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    handleMenuClose();
                    handleProtectedNavigation(item.path);
                  }}
                  sx={{
                    py: 1.5,
                    fontWeight: 500,
                    fontSize: "1rem",
                    color: "#ffffff",
                    borderBottom: index < navItems.length - 1 ? "1px solid #2a2a2a" : "none",
                    "&:hover": {
                      backgroundColor: "#1f1f1f",
                      color: "#388e3c",
                    },
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>


            {/* Title */}
            <Box display={"flex"}>

              <Logo />
              <Typography
                sx={{
                  flexGrow: 1,
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Placement Portal
              </Typography>
            </Box>

            {/* Logout Button */}
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </>
      ) : (

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // logo on left, buttons on right
            width: "100%",
            px: 2,
          }}
        >
          {/* Logo on the left */}
          <Logo />

          {/* Buttons on the right */}
          <Box sx={{ display: "flex", gap: 2.5 }}>
            {navItems.map((item, index) => (
              <Button
                key={index}
                color="inherit"
                sx={{
                  transition: "0.3s ease",
                  "&:hover": {
                    boxShadow: "0 0 10px 3px rgba(30, 144, 255, 0.4)",
                    transform: "scale(1.03)",
                  },
                }}
                onClick={() => handleProtectedNavigation(item.path)}
              >
                {item.label}
              </Button>
            ))}
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
              sx={{
                borderColor: "inherit",
                color: "inherit",
                "&:hover": {
                  borderColor: "secondary.main",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>


      )}
      {/* </Toolbar> */}
      {/* // </AppBar> */}
    </>
  );
};

export default Navbar;