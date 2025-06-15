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
  useMediaQuery,
  useTheme,
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
import { media } from "@/src/utils/breakpoints";


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
  isApplied: number;
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
  isApplied,
}) => {
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [studentFound, setStudentFound] = useState<boolean | null>(null); // ✅ move here
  const alertShownRef = useRef(false);
  const isMobile = useMediaQuery("(max-width:460px)");




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
        const res = await getInterestedStudentByEnrollment(Number(enrollmentNumber));
        if (res) {
          setStudentFound(true);
        } else {
          setStudentFound(false);
        }
      } catch (error) {
        setStudentFound(false);
      }

      // ✅ Set alreadyApplied using prop
      setAlreadyApplied(isApplied === 1);
    };

    checkApplied();
  }, [isApplied]);


  const handleApply = async () => {
    if (alreadyApplied) {
      alert("You have already applied")
      return;
    }
    else if (!studentFound) {
      alert("Please fill your profile!")
      window.location.href = "/myProfile";
      return;
    };

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
      window.location.href = "/myProfile";
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
      {!isMobile && (

        <CardContent>
          <Grid container spacing={isMobile ? 7 : 2}>
            {/* 1st to 4th Columns: Job Info */}
            {(() => {
              const data = [
                { label: "Company & Role", value: `${companyName} - ${jobTitle}` },
                {
                  label: "Type",
                  value: (
                    <>
                      {jobType} | <strong>Opportunity:</strong> {opportunityType}
                    </>
                  )
                }, { label: "Branches Eligible", value: branchEligible.join(", ") },
                { label: "Min CGPA", value: minCGPA },
                { label: "10th % | 12th %", value: `${minClass10}% | ${minClass12}%` },
                { label: "Deadline", value: new Date(deadline).toLocaleDateString() },
                { label: "Bond", value: bond },
                { label: "Stipend", value: stipend ? `₹${stipend}` : "N/A" },
                { label: "Package", value: `₹${pkg} LPA` },
                { label: "Handle By", value: handleBy },
                { label: "Backlog", value: backlog },
                { label: "Remarks", value: remarks },
              ].filter(item => item.value !== null);

              // Manually split into 4 columns, inserting "Courses Eligible" in column 2
              const columnData = [
                data.slice(0, 3), // Column 1
                [data[3], { label: "Courses Eligible", value: courseEligible.join(", ") }, ...data.slice(4, 6)], // Column 2 (5 items)
                data.slice(6, 9), // Column 3
                data.slice(9),    // Column 4
              ];

              return columnData.map((column, idx) => (
                <Grid item xs={12} sm={6} md={2} key={idx} sx={{ [media.st]: { flexBasis: '20%', maxWidth: '20%' } }}>
                  {column.map((item, index) => (
                    <Typography variant="body2" gutterBottom key={index}>
                      <strong>{item.label}:</strong> {item.value}
                    </Typography>
                  ))}
                </Grid>
              ));
            })()}

            {/* 5th Column: Icons */}
            <Grid item xs={12} sm={6} md={2} sx={{
              [media.st]: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                flexBasis: '20%',
                maxWidth: '20%',
              },
            }}>
              <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
                sx={{ [media.st]: { flex: 1, mt: "-70px" } }}
              >
                <Grid item>
                  <Tooltip title="Copy Job Data">
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
            <Grid item xs={12} sm={6} md={2} >
              <Grid container direction="column" alignItems="center" sx={{
                [media.st]: { alignItems: "flex-end", mt: "-50px" }
              }}>
                <Grid item>
                  {/* <Button
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
                      alreadyApplied || studentFound === false ? "#black" : "fff",
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
                </Button> */}
                  <Button
                    variant="contained"
                    // disabled={alreadyApplied || studentFound === false}
                    onClick={handleApply}
                    endIcon={<SendIcon />}
                    sx={{
                      fontSize: "0.8rem",
                      padding: "4px 10px",
                      minWidth: "80px",
                      backgroundColor:
                        "success.main",
                      color:
                        "fff",
                      cursor:
                        "pointer",
                      "&:hover": {
                        backgroundColor:
                          "success.dark",
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
                    {"Apply"}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>





        </CardContent>
      )}
      {isMobile && (
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              {[
                { label: "Company & Role", value: `${companyName} - ${jobTitle}` },
                {
                  label: "Type",
                  value: (
                    <>
                      {jobType} & <strong>Opportunity:</strong> {opportunityType}
                    </>
                  ),
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
                  value: (
                    <>
                      {minCGPA} & <strong>Deadline:</strong> {new Date(deadline).toLocaleDateString()}
                    </>
                  ),
                },
                {
                  label: "10th %",
                  value: (
                    <>
                      {minClass10}% & <strong>12th:</strong> {minClass12}%
                    </>
                  ),
                },
                {
                  label: "Bond",
                  value: (
                    <>
                      {bond} & <strong>Handle By:</strong> {handleBy}
                    </>
                  ),
                },
                {
                  label: "Stipend",
                  value: stipend ? (
                    <>
                      ₹{stipend} & <strong>Package:</strong> ₹{pkg} LPA
                    </>
                  ) : (
                    "N/A"
                  ),
                },
                {
                  label: "Backlog",
                  value: backlog,
                },
                {
                  label: "Remarks",
                  value: remarks,
                }

              ]
                .filter((item) => item.value !== null)
                .map((item, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{ mb: 1, wordBreak: "break-word" }}
                  >
                    <strong>{item.label}:</strong> {item.value}
                  </Typography>
                ))}
            </Grid>

            {/* Buttons and Icons */}
            <Grid item xs={12} sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Tooltip title="Copy Job Data">
                <IconButton onClick={handleCopyJSON} color="primary">
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="View Job Description">
                <IconButton onClick={handleViewPDF} color="info">
                  <DescriptionIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                onClick={handleApply}
                endIcon={<SendIcon />}
                sx={{
                  fontSize: "0.8rem",
                  padding: "4px 10px",
                  backgroundColor: "success.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "success.dark",
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
        </CardContent>


      )}
    </Card>
  );
};

export default JobBarTile;
