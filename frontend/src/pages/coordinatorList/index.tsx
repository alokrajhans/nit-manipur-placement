import React from "react";
import { Grid, Container, Box, Button } from "@mui/material";
import CoordinatorTile from "@/src/components/coordinator";
import Navbar from "@/src/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/router";
import ShowIfAdmin from "@/src/components/ShowIfAdmin";
import { media } from "@/src/utils/breakpoints";
export default function Coordinators() {
  const router = useRouter();

  const data = [
    {
      name: "Alok Raj",
      branch: "ECE",
      enrollmentNumber: "NITM123456",
      email: "alokraj@nitm.ac.in",
      contactNumber: "9876543210",
    },
    {
      name: "Neha Sharma",
      branch: "CSE",
      enrollmentNumber: "NITM654321",
      email: "neha@nitm.ac.in",
      contactNumber: "9123456789",
    },
    {
      name: "Rahul Kumar",
      branch: "ME",
      enrollmentNumber: "NITM789012",
      email: "rahul@nitm.ac.in",
      contactNumber: "9988776655",
    },
    {
      name: "Sneha Das",
      branch: "CE",
      enrollmentNumber: "NITM567890",
      email: "sneha@nitm.ac.in",
      contactNumber: "9112233445",
    },
    {
      name: "Amit Verma",
      branch: "EE",
      enrollmentNumber: "NITM333222",
      email: "amit@nitm.ac.in",
      contactNumber: "9012345678",
    },
  ];

  // Define custom branch order
  const branchOrder = ["CSE", "ECE", "EE", "ME", "CE"];

  // Sort data based on branch priority
  const sortedData = data.sort(
    (a, b) => branchOrder.indexOf(a.branch) - branchOrder.indexOf(b.branch)
  );

  return (
    <Container sx={{ [media.st]: { color: "primary", backgroundColor: "background.default", width: "100%", alignItems: 'stretch', mr: "20px" } }}>
      {/* <Box>
      <Navbar />
    </Box> */}

      {/* Button below Navbar */}
      <ShowIfAdmin>
        <Button
          variant="contained"
          onClick={() => router.push("/interested-students")}
          sx={{
            mt: "15px",
            mr: "15px",
            backgroundColor: "#388e3c",
            color: "black",
            "&:hover": {
              backgroundColor: "#2e7031",
            },
          }}
        >
          Interested Students List
        </Button>
      </ShowIfAdmin>
      {/* <Button
        variant="contained"
        onClick={() => router.push("/applied-jobs")}
        sx={{
          mt:"15px",
          backgroundColor: "#388e3c",
          color: "black",
          "&:hover": {
            backgroundColor: "#2e7031",
          },
        }}
      >
        APPLIED JOBS List
      </Button> */}

      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {sortedData.map((coord, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{
                [media.st]: {
                  // flexBasis: "33.33%",
                  maxWidth: "100%",
                },
              }}
            >
              <CoordinatorTile {...coord} />
            </Grid>
          ))}
        </Grid>
      </Container>


    </Container>
  );
}
