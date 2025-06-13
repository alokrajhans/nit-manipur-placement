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
import StudentSelection from "@/src/components/studentSelection";
import { getSelectedStudents, SelectedStudent } from "@/src/service/selectedStudents";
import ShowIfAdmin from "@/src/components/ShowIfAdmin";
import { media } from "@/src/utils/breakpoints";

interface JobOffer {
  companyName: string;
  package: string | number;
  offerType: string;
  internship: string;
}

// Extend SelectedStudent if you want, or just map your API data
interface StudentWithOffers extends SelectedStudent {
  name: string;
  branch: string;
  jobOffers: JobOffer[];
}

export default function SelectedStudentsPage() {
  const [allSelectedStudents, setAllSelectedStudents] = useState<StudentWithOffers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const students = await getSelectedStudents();

        // Map flat API response to the structured format expected
        const mappedStudents: StudentWithOffers[] = students.map((student) => {
          const jobOffers: JobOffer[] = [];

          for (let i = 1; i <= 3; i++) {
            const company = student[`company${i}`];
            const pack = student[`package${i}`];
            const type = student[`type${i}`];
            const internship = student[`internship${i}`];

            if (company && company.trim() !== "") {
              jobOffers.push({
                companyName: company,
                package: pack,
                offerType: type,
                internship,
              });
            }
          }

          return {
            enrollmentNumber: student.enrollment_number,
            name: student.full_name || "",
            branch: student.Branch || "",
            jobOffers,
            ...student,
          };
        });

        setAllSelectedStudents(mappedStudents);
      } catch (error) {
        console.error("Error fetching selected students:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const maxOffers = Math.max(
    1,
    ...allSelectedStudents.map((s) => s.jobOffers.length)
  );

  const handleDownloadExcel = () => {
    const excelData: any[] = [];

    allSelectedStudents.forEach((student) => {
      const row: any = {
        Name: student.name,
        EnrollmentNumber: student.enrollment_number,
        Branch: student.branch,
        NumberOfOffers: student.jobOffers.length,
      };

      student.jobOffers.forEach((offer, i) => {
        row[`Company ${i + 1}`] = offer.companyName;
        row[`Package ${i + 1}`] = offer.package;
        row[`Type ${i + 1}`] = offer.offerType;
        row[`Internship ${i + 1}`] = offer.internship;
      });

      for (let i = student.jobOffers.length; i < maxOffers; i++) {
        row[`Company ${i + 1}`] = "";
        row[`Package ${i + 1}`] = "";
        row[`Type ${i + 1}`] = "";
        row[`Internship ${i + 1}`] = "";
      }

      excelData.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Students");
    XLSX.writeFile(workbook, "Selected_Students.xlsx");
  };

  if (loading) {
    return (
      <Container>
        <Box mt={4} textAlign="center">
          <Typography variant="h6">Loading selected students...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      {/* <Box>
        <Navbar />
      </Box> */}

      <Box mt={4} sx={{[media.st] :{ color:"primary",backgroundColor:"background.default",width:"100%", alignItems: 'stretch',mr:"20px"}}}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography variant="h4" gutterBottom>
            Selected Students
          </Typography>
          <Box><StudentSelection /></Box>
          <ShowIfAdmin>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#388e3c",
              "&:hover": { backgroundColor: "#2e7d32" },
            }}
            onClick={handleDownloadExcel}
          >
            Download AS Excel
          </Button>
          </ShowIfAdmin>
        </Box>

        <Box sx={{ overflowX: "auto", width: "100%" }}>
          <TableContainer component={Paper} sx={{ minWidth: "2000px" }}>
            <Table stickyHeader sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Enrollment No</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Branch</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>No. of Offers</TableCell>

                  {[...Array(maxOffers)].map((_, i) => (
                    <React.Fragment key={i}>
                      <TableCell sx={{ fontWeight: "bold" }}>Company {i + 1}</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Package {i + 1}</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Type {i + 1}</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Internship {i + 1}</TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {allSelectedStudents.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.enrollment_number}</TableCell>
                    <TableCell>{student.branch}</TableCell>
                    <TableCell>{student.jobOffers.length}</TableCell>

                    {[...Array(maxOffers)].map((_, i) => {
                      const offer = student.jobOffers[i];
                      return (
                        <React.Fragment key={i}>
                          <TableCell>{offer?.companyName || ""}</TableCell>
                          <TableCell>{offer?.package || ""}</TableCell>
                          <TableCell>{offer?.offerType || ""}</TableCell>
                          <TableCell>{offer?.internship || ""}</TableCell>
                        </React.Fragment>
                      );
                    })}
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
