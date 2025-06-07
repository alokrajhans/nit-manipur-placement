"use client";

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
} from "@mui/material";

interface CompanyInfo {
  companyName: string;
  package: string;
  type: "Full Time" | "PPO";
  internship: boolean;
}

interface StudentInfo {
  name: string;
  enrollmentNumber: string;
  branch: string;
  jobOffers: CompanyInfo[];
}

interface SelectedStudentListProps {
  branch: string;
  students: StudentInfo[];
}

const SelectedStudentList: React.FC<SelectedStudentListProps> = ({
  branch,
  students,
}) => {
  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Selected Students - {branch}
      </Typography>

      <Grid container spacing={3}>
        {students.map((student, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper
              elevation={3}
              sx={{ p: 3, backgroundColor: "#1e1e1e", color: "#fff" }}
            >
              <Typography variant="h6">{student.name}</Typography>
              <Typography variant="body2">
                Enrollment No: {student.enrollmentNumber}
              </Typography>
              <Typography variant="body2">Branch: {student.branch}</Typography>
              <Typography variant="body2">
                No. of Offers: {student.jobOffers.length}
              </Typography>

              <Divider sx={{ my: 1, backgroundColor: "#555" }} />

              {student.jobOffers.map((offer, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    Company {idx + 1}:
                  </Typography>
                  <Typography variant="body2">
                    Company Name: {offer.companyName}
                  </Typography>
                  <Typography variant="body2">
                    Package: {offer.package}
                  </Typography>
                  <Typography variant="body2">
                    Type: {offer.type}
                  </Typography>
                  <Typography variant="body2">
                    Internship: {offer.internship ? "Yes" : "No"}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SelectedStudentList;
