"use client";

import React from "react";
import { Paper, Typography, Box } from "@mui/material";

type CoordinatorTileProps = {
  name: string;
  branch: string;
  enrollmentNumber: string;
  email: string;
  contactNumber: string;
};

const CoordinatorTile: React.FC<CoordinatorTileProps> = ({
  name,
  branch,
  enrollmentNumber,
  email,
  contactNumber,
}) => {
  return (
    <Paper
      elevation={4}
      sx={{
        backgroundColor: "#1e1e1e",
        color: "#fff",
        p: 3,
        borderRadius: 3,
        minWidth: "250px",
        transition: "transform 0.2s",
       "&:hover": {
          boxShadow: "0 0 12px 4px rgba(255, 255, 255, 0.3)", // white glow
          transform: "scale(1.01)",
        },
      }}
    >
      <Typography variant="h6" gutterBottom>
        <strong>{name}</strong>
      </Typography>

      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Branch:</strong> {branch}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Enrollment No.:</strong> {enrollmentNumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Email:</strong> {email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Contact:</strong> {contactNumber}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CoordinatorTile;
