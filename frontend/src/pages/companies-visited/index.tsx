"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import Navbar from "@/src/components/Navbar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const companiesVisited = [
  {
    companyName: "Google",
    type: "IT",
    date: "2025-01-15",
    package: 45,
    offers: 10,
    internship: "Yes",
    hrEmail: "hr@google.com",
    hrContact: "9876543210",
    status: "Completed",
  },
  {
    companyName: "Tata Steel",
    type: "Core",
    date: "2025-02-10",
    package: 12,
    offers: 5,
    internship: "No",
    hrEmail: "recruitment@tatasteel.com",
    hrContact: "9123456789",
    status: "Ongoing",
  },
  // Add more entries here if needed
];

export default function CompaniesVisitedPage() {
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(companiesVisited);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(file, "Companies_Visited.xlsx");
  };

  return (
    <Container>
      <Box>
        <Navbar />
      </Box>

      <Box mt={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" gutterBottom>
            Companies Visited
          </Typography>

          <Button
            variant="contained"
            onClick={handleDownloadExcel}
            sx={{
              backgroundColor: "#388e3c",
              "&:hover": { backgroundColor: "#2e7d32" },
            }}
          >
            Download as Excel
          </Button>
        </Box>
      </Box>

      <Box sx={{ overflowX: "auto" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1000 }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Package (LPA)</TableCell>
                <TableCell>Offers</TableCell>
                <TableCell>Internship</TableCell>
                <TableCell>HR Email</TableCell>
                <TableCell>HR Contact</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companiesVisited.map((company, index) => (
                <TableRow key={index}>
                  <TableCell>{company.companyName}</TableCell>
                  <TableCell>{company.type}</TableCell>
                  <TableCell>{company.date}</TableCell>
                  <TableCell>{company.package}</TableCell>
                  <TableCell>{company.offers}</TableCell>
                  <TableCell>{company.internship}</TableCell>
                  <TableCell>{company.hrEmail}</TableCell>
                  <TableCell>{company.hrContact}</TableCell>
                  <TableCell>{company.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
