"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Grid,
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DescriptionIcon from "@mui/icons-material/Description";
import SendIcon from "@mui/icons-material/Send";

type JobBarTileProps = {
  companyName: string;
  jobTitle: string;
  jobType: "IT" | "Core";
  branchEligible: ("CSE" | "ECE" | "EE" | "ME" | "CE")[];
  courseEligible: ("B.Tech" | "M.Tech" | "M.Sc")[];
  minCGPA: number;
  minClass10: number;
  minClass12: number;
  deadline: string;
  opportunityType: "Internship" | "PPO" | "Full time";
  bond: "Bond" | "No Bond";
  stipend?: string;
  package: string;
  jobId: string;
  jobDescriptionLink: string;
  remarks?: string;
};

const JobBarTile: React.FC<JobBarTileProps> = ({
  companyName,
  jobTitle,
  jobType,
  branchEligible,
  courseEligible,
  minCGPA,
  minClass10,
  minClass12,
  deadline,
  opportunityType,
  bond,
  stipend,
  package: pkg,
  jobId,
  jobDescriptionLink,
  remarks,
}) => {
  const jobLink = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/jobs/${jobId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(jobLink);
      alert("Job link copied to clipboard!");
    } catch {
      alert("Failed to copy link.");
    }
  };

  const handleViewPDF = () => {
    window.open(jobDescriptionLink, "_blank");
  };

  const handleApply = async () => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to apply");

      alert("Application submitted!");
    } catch {
      alert("Error while applying.");
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        backgroundColor: "#1e1e1e",
        color: "#fff",
        transition: "0.3s ease",
        "&:hover": {
          boxShadow: "0 0 12px 4px rgba(255, 255, 255, 0.3)", // white glow
          transform: "scale(1.01)",
        },
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          {/* Left content */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              {/* First Column */}
              {/* <Grid item xs={12} sm={6} mr={"90px"}> */}
              <Grid item xs={12} sm={6} ml={"10px"}>
                <Typography variant="h6" gutterBottom>
                  {companyName} - {jobTitle}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Type:</strong> {jobType} |{" "}
                  <strong>Opportunity:</strong> {opportunityType}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Branches Eligible:</strong>{" "}
                  {branchEligible.join(", ")}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} mt={"8px"}>
                <Typography variant="body2" gutterBottom>
                  <strong>Courses Eligible:</strong> {courseEligible.join(", ")}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Min CGPA:</strong> {minCGPA}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>10th %:</strong> {minClass10}% |{" "}
                  <strong>12th %:</strong> {minClass12}%
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} mt={"8px"}>
                <Typography variant="body2" gutterBottom>
                  <strong>Deadline:</strong> {deadline}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Bond:</strong> {bond}
                </Typography>
                {stipend && (
                  <Typography variant="body2" gutterBottom>
                    <strong>Stipend:</strong> ₹{stipend}
                  </Typography>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                mt={"8px"}
                mr={"10px"}
                maxWidth={"200px"}
                minWidth={"190px"}
              >
                <Typography variant="body2" gutterBottom>
                  <strong>Package:</strong> ₹{pkg} LPA
                </Typography>
                {remarks && (
                  <Typography variant="body2" gutterBottom>
                    <strong>Remarks:</strong> {remarks}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>

          {/* Right: Buttons */}
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 2, // space between icons and button container
              width: "100%",
              mt:"-100px"
            }}
          >
            <Grid
              item
              xs="auto"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Tooltip title="Copy Job Link">
                <IconButton onClick={handleCopyLink} color="primary">
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="View Job Description">
                <IconButton onClick={handleViewPDF} color="info">
                  <DescriptionIcon />
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid
              item
              xs="auto"
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="success"
                endIcon={<SendIcon />}
                onClick={handleApply}
                sx={{
                  fontSize: "0.8rem",
                  padding: "4px 10px",
                  minWidth: "80px",
                }}
              >
                Apply
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default JobBarTile;
