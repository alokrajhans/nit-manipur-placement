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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import * as XLSX from "xlsx";
import Navbar from "@/src/components/Navbar";
import {
  getInterestedStudents,
  InterestedStudent,
} from "@/src/service/interestedStudents";
import { AppliedJob, getAllAppliedJobs } from "@/src/service/appliedJobs";
import { getOngoingJobs, OngoingJob } from "@/src/service/ongoingJobs";
import ShowIfAdmin from "@/src/components/ShowIfAdmin";
import { media } from "@/src/utils/breakpoints";

export default function AppliedJobsPage() {
  const [interestedStudents, setInterestedStudents] = useState<
    InterestedStudent[]
  >([]);
  const [interestedCandidates, setInterestedCandidates] = useState<
    AppliedJob[]
  >([]);
  const [companiesList, setCompaniesList] = useState<OngoingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<string>("");

  // Helper: Remove duplicates by company_name + enrollment_number
  const removeDuplicateCandidates = (candidates: AppliedJob[]) => {
    const seen = new Set<string>();
    const filtered = candidates.filter((candidate) => {
      const company = candidate.company_name.trim().toLowerCase();
      const enrollment = candidate.enrollment_number.trim();
      const key = `${company}_${enrollment}`;
      if (seen.has(key)) {
        // console.log("Duplicate found and removed:", candidate);
        return false;
      }
      seen.add(key);
      return true;
    });
    // console.log("Filtered unique candidates count:", filtered.length);
    return filtered;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const candidates = await getAllAppliedJobs();
        const uniqueCandidates = removeDuplicateCandidates(candidates);
        setInterestedCandidates(uniqueCandidates);

        const students = await getInterestedStudents();
        setInterestedStudents(students);

        const companiesLt = await getOngoingJobs();
        setCompaniesList(companiesLt);

        // Auto-select first company if available
        if (companiesLt.length > 0) {
          setSelectedCompany(companiesLt[0].company_name || "");
        } else if (uniqueCandidates.length > 0) {
          setSelectedCompany(uniqueCandidates[0].company_name || "");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDownloadExcel = () => {
    const appliedEnrollmentNumbers = interestedCandidates
      .filter((candidate) => candidate.company_name === selectedCompany)
      .map((candidate) => candidate.enrollment_number);

    const filteredStudents = interestedStudents.filter((student) =>
      appliedEnrollmentNumbers.includes(student.enrollment_number.toString())
    );

    const excelData = filteredStudents.map((student) => ({
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
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `${selectedCompany}_Applicants`
    );
    XLSX.writeFile(workbook, `${selectedCompany}_Applicants.xlsx`);
  };

  if (loading) {
    return (
      <Container>
        <Box mt={4} textAlign="center">
          <Typography variant="h6">Loading applied jobs...</Typography>
        </Box>
      </Container>
    );
  }

  // Get unique enrollment numbers for selected company
  const uniqueEnrollmentNumbers = Array.from(
    new Set(
      interestedCandidates
        .filter((c) => c.company_name === selectedCompany)
        .map((c) => c.enrollment_number)
    )
  );

  return (
    <Container sx={{ [media.st]: { color: "primary", backgroundColor: "background.default", width: "100%", alignItems: 'stretch', mr: "20px" } }}>
      {/* <Box>
        <Navbar />
      </Box> */}

      <Box mt={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="h4" gutterBottom>
            Applied Jobs by Company
          </Typography>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Company</InputLabel>
            <Select
              value={selectedCompany}
              label="Company"
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              {companiesList.map((company) => (
                <MenuItem key={company.id} value={company.company_name}>
                  {company.company_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <ShowIfAdmin>
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
          </ShowIfAdmin>
        </Box>

        <Box sx={{ overflowX: "auto", width: "100%", mt: 3 }}>
          <TableContainer component={Paper} sx={{ minWidth: "2000px" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Company Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Enrollment No
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Branch</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    College Email
                  </TableCell>
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
                {uniqueEnrollmentNumbers.map((enrollmentNumber, index) => {
                  const student = interestedStudents.find(
                    (s) => s.enrollment_number.toString() === enrollmentNumber
                  );
                  const candidate = interestedCandidates.find(
                    (c) =>
                      c.company_name === selectedCompany &&
                      c.enrollment_number === enrollmentNumber
                  );

                  if (!student) return null;

                  return (
                    <TableRow key={index}>
                      <TableCell>{candidate?.company_name}</TableCell>
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
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Container>
  );
}
