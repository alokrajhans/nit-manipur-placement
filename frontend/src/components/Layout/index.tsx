// src/components/Layout.tsx
"use client";

import React from "react";
import { useRouter } from "next/router";
import Footer from "../footer";
import { Container, Box } from "@mui/material";
import Navbar from "../Navbar";
// import Navbar from "../Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(router.pathname);

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
    >
      {!shouldHideNavbar && (
        <Container>
          <Navbar />
        </Container>
      )}

      {/* Main content grows to push footer to the bottom */}
      <Box component="main" flex="1">
        {children}
      </Box>

      {/* Always shown at the bottom */}
      {!shouldHideNavbar && <Footer />}
    </Box>
  );
};

export default Layout;
