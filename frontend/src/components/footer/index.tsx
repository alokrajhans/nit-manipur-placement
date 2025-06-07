import React from "react";
import { Box, Typography,Container, Link } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Container>
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "light" ? "#f5f5f5" : "#333",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        &copy; {new Date().getFullYear()} Alok Raj Hans. All rights reserved.{" "}
        <Link href="/rules" underline="hover">
          Rules of Placement.
        </Link>
      </Typography>
    </Box>
    </Container>
  );
};

export default Footer;
