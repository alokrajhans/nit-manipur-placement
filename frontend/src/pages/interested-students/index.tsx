/* eslint-disable */
"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import * as XLSX from "xlsx";
import Navbar from "@/src/components/Navbar";
import { getInterestedStudents, InterestedStudent } from "@/src/service/interestedStudents";

export default function InterestedStudentsPage() {
  const [interestedStudents, setInterestedStudents] = useState<InterestedStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const students = await getInterestedStudents();
        setInterestedStudents(students);
      } catch (error) {
        console.error("Error fetching interested students:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDownloadExcel = () => {
    const excelData = interestedStudents.map((student) => ({
      Name: student.full_name || "",
      EnrollmentNumber: student.enrollment_number,
      Branch: student.Branch || "",
      Email: student.college_email || "",
      Gmail: student.gmail_id || "",
      Phone: student.phone_number || "",
      AlternatePhone: student.alternate_phone_number || "",
      CGPA: student.cgpa ?? "",
      "Class 12 %": student.class_12th_percentage ?? "",
      "Class 10 %": student.class_10th_percentage ?? "",
      Resume: student.resume_drive_link || "",
      Age: student.Age ?? "",
      GapYear: student.gap_year ?? "",
      Backlog: student.Backlog || "",
      Gender: student.Gender || "",
      Course: student.Course || "",
      Batch: student.Batch ?? "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Interested Students");
    XLSX.writeFile(workbook, "Interested_Students.xlsx");
  };

  if (loading) {
    return (
      <Container>
        <Box mt={4} textAlign="center">
          <Typography variant="h6">Loading interested students...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      {/* <Box>
        <Navbar />
      </Box> */}

      <Box mt={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography variant="h4" gutterBottom>
            All Interested Students
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#388e3c",
              "&:hover": { backgroundColor: "#2e7d32" },
            }}
            onClick={handleDownloadExcel}
          >
            Download As Excel
          </Button>
        </Box>

        <Box sx={{ overflowX: "auto", width: "100%" }}>
          <TableContainer component={Paper} sx={{ minWidth: "2000px" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Enrollment No</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Branch</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>College Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Gmail ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Alt Phone</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>CGPA</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>12th %</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>10th %</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Resume</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Age</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Gap Year</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Backlog</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Gender</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Batch</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {interestedStudents.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.full_name}</TableCell>
                    <TableCell>{student.enrollment_number}</TableCell>
                    <TableCell>{student.Branch}</TableCell>
                    <TableCell>{student.college_email}</TableCell>
                    <TableCell>{student.gmail_id}</TableCell>
                    <TableCell>{student.phone_number}</TableCell>
                    <TableCell>{student.alternate_phone_number}</TableCell>
                    <TableCell>{student.cgpa}</TableCell>
                    <TableCell>{student.class_12th_percentage}</TableCell>
                    <TableCell>{student.class_10th_percentage}</TableCell>
                    <TableCell>{student.resume_drive_link}</TableCell>
                    <TableCell>{student.Age}</TableCell>
                    <TableCell>{student.gap_year}</TableCell>
                    <TableCell>{student.Backlog}</TableCell>
                    <TableCell>{student.Gender}</TableCell>
                    <TableCell>{student.Course}</TableCell>
                    <TableCell>{student.Batch}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Container>
  );
}
