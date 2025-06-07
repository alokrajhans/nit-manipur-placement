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
  backlog: ("No Active Backlog" | "No History Backlog" | "No Critera for Backlog");
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


  const jobLink = `${typeof window !== "undefined" ? window.location.origin : ""
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
          {/* 4 Columns with 3 items each */}
          {[
            {
              label: "Type",
              value: `${jobType} | Opportunity: ${opportunityType}`,
            },
            {
              label: "Branches Eligible",
              value: branchEligible.join(", "),
            },
            {
              label: "Courses Eligible",
              value: courseEligible.join(", "),
            },
            {
              label: "Min CGPA",
              value: minCGPA,
            },
            {
              label: "10th % | 12th %",
              value: `${minClass10}% | ${minClass12}%`,
            },
            {
              label: "Deadline",
              value: new Date(deadline).toLocaleDateString(),
            },
            {
              label: "Bond",
              value: bond,
            },
            {
              label: "Stipend",
              value: stipend ? `₹${stipend}` : null,
            },
            {
              label: "Package",
              value: `₹${pkg} LPA`,
            },
            {
              label: "Handle By",
              value: handleBy,
            },
            {
              label: "Backlog",
              value: backlog,
            },
            {
              label: "Remarks",
              value: remarks,
            },
          ]
            .filter((item) => item.value !== null)
            .reduce((acc, curr, index) => {
              const col = Math.floor(index / 3);
              if (!acc[col]) acc[col] = [];
              acc[col].push(curr);
              return acc;
            }, [])
            .map((column, colIndex) => (
              <Grid item xs={12} sm={6} md={2} key={colIndex}>
                {column.map((item, idx) => (
                  <Typography variant="body2" gutterBottom key={idx}>
                    <strong>{item.label}:</strong> {item.value}
                  </Typography>
                ))}
              </Grid>
            ))}

          {/* 5th Column: Icons */}
          <Grid item xs={12} sm={6} md={2}>
            <Grid
              container
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <Tooltip title="Copy Job Link">
                  <IconButton onClick={handleCopyJSON} color="primary">
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="View Job Description">
                  <IconButton onClick={handleViewPDF} color="info">
                    <DescriptionIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>

          {/* 6th Column: Apply Button */}
          <Grid item xs={12} sm={6} md={2}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
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
        </Grid>



      </CardContent>
    </Card>
  );
};

export default JobBarTile;
