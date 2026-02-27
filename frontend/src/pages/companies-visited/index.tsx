import React, { useEffect, useState } from "react";
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
import {
  getCompaniesVisited,
  CompanyVisited,
} from "@/src/service/companyVisited";
import ShowIfAdmin from "@/src/components/ShowIfAdmin";
import { media } from "@/src/utils/breakpoints";

export default function CompaniesVisitedPage() {
  const [companiesVisited, setCompaniesVisited] = useState<CompanyVisited[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
        const data = await getCompaniesVisited();
        setCompaniesVisited(data);
      } catch (err) {
        setError("Failed to load companies data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

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
      {/* <Box>
        <Navbar />
      </Box> */}

      <Box mt={4} sx={{ [media.st]: { color: "primary", backgroundColor: "background.default", width: "100%", alignItems: 'stretch', mr: "20px" } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" gutterBottom>
            Companies Visited
          </Typography>

          <ShowIfAdmin>
            <Button
              variant="contained"
              onClick={handleDownloadExcel}
              sx={{
                backgroundColor: "#388e3c",
                "&:hover": { backgroundColor: "#2e7d32" },
                [media.st]:{mr:"10px"}
              }}
              disabled={loading || companiesVisited.length === 0}
            >
              Download as Excel
            </Button>
          </ShowIfAdmin>
        </Box>
      </Box>

      <Box sx={{ overflowX: "auto", [media.st]: { color: "primary", backgroundColor: "background.default", width: "100%", alignItems: 'stretch', mr: "20px" }}} >
        {loading && <Typography>Loading companies data...</Typography>}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && companiesVisited.length === 0 && (
          <Typography sx={{ mt: 2 }}>
            No companies visited data available.
          </Typography>
        )}

        {!loading && !error && companiesVisited.length > 0 && (
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
                  <ShowIfAdmin>
                    <TableCell>HR Email</TableCell>
                    <TableCell>HR Contact</TableCell>
                  </ShowIfAdmin>
                  {/* <TableCell>Status</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {companiesVisited.map((company, index) => (
                  <TableRow key={company.id ?? index}>
                    <TableCell>{company.company_name ?? "-"}</TableCell>
                    <TableCell>{company.type ?? "-"}</TableCell>
                    <TableCell>
                      {company.date
                        ? new Date(company.date).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>{company.package ?? "-"}</TableCell>
                    <TableCell>{company.offers ?? "-"}</TableCell>
                    <TableCell>{company.internship ?? "-"}</TableCell>
                    <ShowIfAdmin>
                      <TableCell>{company.hr_email ?? "-"}</TableCell>
                      <TableCell>{company.hr_contact ?? "-"}</TableCell>
                    </ShowIfAdmin>
                    {/* <TableCell>{company.status ?? "-"}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
}
