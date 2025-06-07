"use client";

import React, { useEffect, useRef, useState } from "react";
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
import {
  AppliedJob,
  createAppliedJob,
  getAllAppliedJobs,
} from "@/src/service/appliedJobs";
import { getInterestedStudentByEnrollment } from "@/src/service/interestedStudents";


// const [alreadyApplied, setAlreadyApplied] = useState(false);
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
  backlog:("No Active Backlog" | "No History Backlog" | "No Critera for Backlog") ;
  handleBy: string;
  remarks?: string;
};
const JobBarTile: React.FC<JobBarTileProps> = ({
  companyName,
  jobTitle,
  jobType,
  branchEligible,
  courseEligible,
  minCGPA,
  backlog,
  minClass10,
  minClass12,
  deadline,
  opportunityType,
  bond,
  stipend,
  package: pkg,
  jobId,
  jobDescriptionLink,
  handleBy,
  remarks,
}) => {
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [studentFound, setStudentFound] = useState<boolean | null>(null); // ✅ move here
  const alertShownRef = useRef(false);


  const jobLink = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/jobs/${jobId}`;

  const handleCopyJSON = async () => {
    const jobData = {
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
      backlog,
      stipend,
      package: pkg,
      jobId,
      jobDescriptionLink,
      handleBy,
      remarks,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(jobData, null, 2));
      alert("Job data copied!");
    } catch {
      alert("Failed to copy job data.");
    }
  };

  const handleViewPDF = () => {
    window.open(jobDescriptionLink, "_blank");
  };
  useEffect(() => {
    const checkApplied = async () => {
      const enrollmentNumber =
        typeof window !== "undefined"
          ? localStorage.getItem("enrollment_number")
          : null;

      if (!enrollmentNumber) {
        setStudentFound(false);
        return;
      }

      try {
        // Check if user is interested student
        try {
          const res = await getInterestedStudentByEnrollment(Number(enrollmentNumber));
          if (res) {
            setStudentFound(true);
          } else {
           
            setStudentFound(false);
          }
          
          // console.log("222",res);
          // console.log("111",studentFound);
        } catch (error) {
          // console.error("Error fetching interested student", error);
          setStudentFound(false);
        }
        
        

        // Check if already applied
        const appliedJobs = await getAllAppliedJobs();
        const hasApplied = appliedJobs.some(
          (job) =>
            job.enrollment_number === enrollmentNumber &&
            job.company_name === companyName
        );
        setAlreadyApplied(hasApplied);
      } catch (error) {
        // console.error("Error checking applied status", error);
        setStudentFound(false);
      }
    };

    checkApplied();
  }, [companyName]);

  const handleApply = async () => {
    if (alreadyApplied || !studentFound) return;

    const enrollmentNumber =
      typeof window !== "undefined"
        ? localStorage.getItem("enrollment_number")
        : null;

    if (!enrollmentNumber) {
      alert("Enrollment number missing. Please log in again.");
      return;
    }

    const applyJobPayload: Partial<AppliedJob> = {
      company_name: companyName,
      enrollment_number: enrollmentNumber,
    };

    try {
      await createAppliedJob(applyJobPayload);
      alert("Application submitted!");
      setAlreadyApplied(true);
    } catch {
      alert("Error while applying.");
    }
  };
  useEffect(() => {
    if (
      studentFound === false &&
      !alertShownRef.current &&
      typeof window !== "undefined" &&
      !(window as any).__alertShownThisLoad
    ) {
      alert("Please fill your details in My Profile section!");
      alertShownRef.current = true;
      (window as any).__alertShownThisLoad = true;
    }
  }, [studentFound]);
  
  
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
                  <strong>Deadline:</strong>{" "}
                  {new Date(deadline).toLocaleDateString()}
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
                <Typography variant="body2" gutterBottom>
                  <strong>Handle By:</strong> {handleBy}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Backlog:</strong> {backlog}
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
              mt: "-100px",
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
                <IconButton onClick={handleCopyJSON} color="primary">
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="View Job Description">
                <IconButton onClick={handleViewPDF} color="info">
                  <DescriptionIcon />
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid item xs="auto">
              <Button
                variant="contained"
                disabled={alreadyApplied || studentFound === false}
                onClick={handleApply}
                endIcon={<SendIcon />}
                sx={{
                  fontSize: "0.8rem",
                  padding: "4px 10px",
                  minWidth: "80px",
                  backgroundColor:
                    alreadyApplied || studentFound === false
                      ? "#d3d3d3"
                      : "success.main",
                  color:
                    alreadyApplied || studentFound === false ? "#000" : "#fff",
                  cursor:
                    alreadyApplied || studentFound === false
                      ? "not-allowed"
                      : "pointer",
                  "&:hover": {
                    backgroundColor:
                      alreadyApplied || studentFound === false
                        ? "#d3d3d3"
                        : "success.dark",
                  },
                }}
                title={
                  studentFound === false
                    ? "You must be an interested student to apply"
                    : alreadyApplied
                    ? "You have already applied"
                    : ""
                }
              >
                {alreadyApplied
                  ? "Applied"
                  : studentFound === false
                  ? "My Profile not filled"
                  : "Apply"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default JobBarTile;
