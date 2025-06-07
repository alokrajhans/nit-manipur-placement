"use client";

import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback } from "react";
import Image from "next/image";
import apiClient from "@/src/utils/apiClient";
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const [openDialog, setOpenDialog] = useState(false);

  // // Form states for controlled inputs
  // const [companyName, setCompanyName] = useState("");
  // const [jobTitle, setJobTitle] = useState("");
  // const [jobType, setJobType] = useState("");
  // const [branchesEligible, setBranchesEligible] = useState<string[]>([]);
  // const [coursesEligible, setCoursesEligible] = useState<string[]>([]);
  // const [minCGPA, setMinCGPA] = useState("");
  // const [minClass10, setMinClass10] = useState("");
  // const [minClass12, setMinClass12] = useState("");
  // const [deadline, setDeadline] = useState("");
  // const [opportunityType, setOpportunityType] = useState("");
  // const [bond, setBond] = useState("");
  // const [stipend, setStipend] = useState("");
  // const [packageLPA, setPackageLPA] = useState("");
  // //   const [jobId, setJobId] = useState("");
  // const [jobDescriptionLink, setJobDescriptionLink] = useState("");
  // const [remarks, setRemarks] = useState("");

  // // For errors
  // const [errors, setErrors] = useState<Record<string, string>>({});
  const handleLogout = useCallback(() => {
    // Clear token from sessionStorage
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("persist:root");
    localStorage.removeItem("enrollment_number");
    localStorage.removeItem("role");

    // Optionally, clear any other auth-related storage (localStorage, cookies, etc.)

    // Redirect to login page (or wherever you want)
    router.push("/login");

    // Optional: alert or toast
    // alert("Logged out successfully");
  }, [router]);

  const Logo = () => (
    // <Typography
    //   variant="h6"
    //   component="div"
    //   sx={{ cursor: "pointer", fontWeight: "bold" }}
    //   onClick={() => router.push("/")}
    //   mr={"10px"}
    //   ml={"-15px"}
    // >
    //   MyLogo
    // </Typography>
    <Box ml={"-15px"} mt={"10px"} mr={"10px"} >
    <Link href="/" passHref>
      <Image
        src="/logo.png"
        alt="Logo"
        width={40}
        height={40}
        style={{
          cursor: "pointer",
          filter: "drop-shadow(0 0 2px white)",
        }}
      />
    </Link>
  </Box>
  );

  // const handleHover = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleCloseMenu = () => {
  //   setAnchorEl(null);
  // };

  // const handleListJobClick = () => {
  //   setOpenDialog(true);
  //   handleCloseMenu();
  // };

  // const handleDialogClose = () => {
  //   setOpenDialog(false);
  //   setErrors({});
  // };

  // const handleBranchesChange = (
  //   event: React.ChangeEvent<{ value: unknown }>
  // ) => {
  //   setBranchesEligible(event.target.value as string[]);
  // };

  // const handleCoursesChange = (
  //   event: React.ChangeEvent<{ value: unknown }>
  // ) => {
  //   setCoursesEligible(event.target.value as string[]);
  // };

  // // Validation on submit
  // const validateForm = () => {
  //   const newErrors: Record<string, string> = {};

  //   if (!companyName.trim()) newErrors.companyName = "Company Name is required";
  //   if (!jobTitle.trim()) newErrors.jobTitle = "Job Title is required";
  //   if (!jobType) newErrors.jobType = "Job Type is required";
  //   if (branchesEligible.length === 0)
  //     newErrors.branchesEligible = "Select at least one Branch Eligible";
  //   if (coursesEligible.length === 0)
  //     newErrors.coursesEligible = "Select at least one Course Eligible";
  //   if (!minCGPA.trim()) newErrors.minCGPA = "Min CGPA is required";
  //   if (!minClass10.trim()) newErrors.minClass10 = "Min Class 10 % is required";
  //   if (!minClass12.trim()) newErrors.minClass12 = "Min Class 12 % is required";
  //   if (!deadline.trim()) newErrors.deadline = "Deadline is required";
  //   if (!opportunityType)
  //     newErrors.opportunityType = "Opportunity Type is required";
  //   if (!bond) newErrors.bond = "Bond selection is required";
  //   if (!stipend.trim()) newErrors.stipend = "Stipend is required";
  //   if (!packageLPA.trim()) newErrors.packageLPA = "Package is required";
  //   // if (!jobId.trim()) newErrors.jobId = "Job ID is required";
  //   if (!jobDescriptionLink.trim())
  //     newErrors.jobDescriptionLink = "Job Description Link is required";

  //   setErrors(newErrors);

  //   return Object.keys(newErrors).length === 0;
  // };

  // const handleSubmit = () => {
  //   if (validateForm()) {
  //     // Handle form submit here
  //     alert("Form Submitted Successfully");
  //     handleDialogClose();

  //     // Reset form states if you want here
  //   }
  // };

  return (
    <>
      <AppBar
        position="static"
        color="primary"
        sx={{ bgcolor: "background.default" }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Logo />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            {/* <Button
              color="inherit"
              onMouseEnter={handleHover}
              sx={{
                transition: "0.3s ease",
                "&:hover": {
                  boxShadow: "0 0 10px 3px rgba(30, 144, 255, 0.4)",
                  transform: "scale(1.03)",
                },
              }}
            >
              Companies
            </Button> */}

            <Button
              color="inherit"
              sx={{
                transition: "0.3s ease",
                "&:hover": {
                  boxShadow: "0 0 10px 3px rgba(30, 144, 255, 0.4)",
                  transform: "scale(1.03)",
                },
              }}
              onClick={async () => {
                try {
                  // 🔐 Check if token is valid via a protected endpoint
                  await apiClient.get("/me"); // Replace with your actual endpoint

                  // ✅ If no error, user is authenticated
                  router.push("/ongoing-jobs");
                } catch (error) {
                  console.warn("User not authenticated:", error);
                  router.push("/login"); // 🚪 redirect to login if not authorized
                }
              }}
            >
              Companies
            </Button>

            <Button
              color="inherit"
              sx={{
                transition: "0.3s ease",
                "&:hover": {
                  boxShadow: "0 0 10px 3px rgba(30, 144, 255, 0.4)",
                  transform: "scale(1.03)",
                },
              }}
              // onClick={() => router.push("/companies-visited")}
              onClick={async () => {
                try {
                  // 🔐 Check if token is valid via a protected endpoint
                  await apiClient.get("/me"); // Replace with your actual endpoint

                  // ✅ If no error, user is authenticated
                  router.push("/companies-visited");
                } catch (error) {
                  console.warn("User not authenticated:", error);
                  router.push("/login"); // 🚪 redirect to login if not authorized
                }
              }}
            >
              Companies Visited
            </Button>
            <Button
              color="inherit"
              sx={{
                transition: "0.3s ease",
                "&:hover": {
                  boxShadow: "0 0 10px 3px rgba(30, 144, 255, 0.4)",
                  transform: "scale(1.03)",
                },
              }}
              // onClick={() => router.push("/selected-students")}
              onClick={async () => {
                try {
                  // 🔐 Check if token is valid via a protected endpoint
                  await apiClient.get("/me"); // Replace with your actual endpoint

                  // ✅ If no error, user is authenticated
                  router.push("/selected-students");
                } catch (error) {
                  console.warn("User not authenticated:", error);
                  router.push("/login"); // 🚪 redirect to login if not authorized
                }
              }}
            >
              Selected Students
            </Button>
            <Button
              color="inherit"
              sx={{
                transition: "0.3s ease",
                "&:hover": {
                  boxShadow: "0 0 10px 3px rgba(30, 144, 255, 0.4)",
                  transform: "scale(1.03)",
                },
              }}
              // onClick={() => router.push("/analytics")}
              onClick={async () => {
                try {
                  // 🔐 Check if token is valid via a protected endpoint
                  await apiClient.get("/me"); // Replace with your actual endpoint

                  // ✅ If no error, user is authenticated
                  router.push("/analytics");
                } catch (error) {
                  console.warn("User not authenticated:", error);
                  router.push("/login"); // 🚪 redirect to login if not authorized
                }
              }}
            >
              Analytics
            </Button>
            <Button
              color="inherit"
              sx={{
                transition: "0.3s ease",
                "&:hover": {
                  boxShadow: "0 0 10px 3px rgba(30, 144, 255, 0.4)",
                  transform: "scale(1.03)",
                },
              }}
              // onClick={() => router.push("/coordinatorList")}
              onClick={async () => {
                try {
                  // 🔐 Check if token is valid via a protected endpoint
                  await apiClient.get("/me"); // Replace with your actual endpoint

                  // ✅ If no error, user is authenticated
                  router.push("/coordinatorList");
                } catch (error) {
                  console.warn("User not authenticated:", error);
                  router.push("/login"); // 🚪 redirect to login if not authorized
                }
              }}
            >
              Coordinator List
            </Button>
            <Button
              color="inherit"
              sx={{
                transition: "0.3s ease",
                "&:hover": {
                  boxShadow: "0 0 10px 3px rgba(30, 144, 255, 0.4)",
                  transform: "scale(1.03)",
                },
              }}
              // onClick={() => router.push("/rules")}
              onClick={async () => {
                try {
                  // 🔐 Check if token is valid via a protected endpoint
                  await apiClient.get("/me"); // Replace with your actual endpoint

                  // ✅ If no error, user is authenticated
                  router.push("/applied-jobs");
                } catch (error) {
                  console.warn("User not authenticated:", error);
                  router.push("/login"); // 🚪 redirect to login if not authorized
                }
              }}
            >
              Applied Jobs
            </Button>
            <Button
              color="inherit"
              sx={{
                transition: "0.3s ease",
                "&:hover": {
                  boxShadow: "0 0 10px 3px rgba(30, 144, 255, 0.4)",
                  transform: "scale(1.03)",
                },
              }}
              // onClick={() => router.push("/myProfile")}
              onClick={async () => {
                try {
                  // 🔐 Check if token is valid via a protected endpoint
                  await apiClient.get("/me"); // Replace with your actual endpoint

                  // ✅ If no error, user is authenticated
                  router.push("/myProfile");
                } catch (error) {
                  console.warn("User not authenticated:", error);
                  router.push("/login"); // 🚪 redirect to login if not authorized
                }
              }}
            >
              My Profile
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
              sx={{
                borderColor: "inherit",
                color: "inherit",
                "&:hover": {
                  borderColor: "secondary.main",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Dialog Form */}
    </>
  );
};

export default Navbar;
