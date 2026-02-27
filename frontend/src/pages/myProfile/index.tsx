/* eslint-disable */
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Grid,
  Paper,
  Container,
  Button,
} from "@mui/material";
import Navbar from "@/src/components/Navbar";
import {
  getInterestedStudentByEnrollment,
  patchInterestedStudent,
  postInterestedStudent,
} from "@/src/service/interestedStudents";
import { media } from "@/src/utils/breakpoints";

// Match your backend enum/values exactly here if possible
const Branches = ["CSE", "ECE", "EE", "ME", "CE"];
const Backlog = ["Active Backlog", "History Backlog", "No Backlog"];
const Courses = ["B.Tech", "M.Tech", "M.Sc"];
const gender = ["Male", "Female", "Other"];
const batch = [2026, 2025];

// Form data interface matching backend keys exactly
interface FormData {
  full_name: string;
  enrollment_number: string; // keep string here, convert on submit
  college_email: string;
  gmail_id: string;
  phone_number: string;
  alternate_phone_number: string;
  cgpa: string;
  class_12th_percentage: string;
  class_10th_percentage: string;
  Branch: string;
  Backlog: string;
  Course: string;
  resume_drive_link: string;
  Age: string;
  gap_year: string;
  Gender: string;
  Batch: string;
}

export default function MyProfile() {
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    enrollment_number: "",
    college_email: "",
    gmail_id: "",
    phone_number: "",
    alternate_phone_number: "",
    cgpa: "",
    class_12th_percentage: "",
    class_10th_percentage: "",
    Branch: "",
    Backlog: "",
    Course: "",
    resume_drive_link: "",
    Age: "",
    gap_year: "",
    Gender: "",
    Batch: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  // Handle input changes - keep all values as string for form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Convert form data strings to proper types matching backend
  const preparePayload = () => {
    return {
      full_name: formData.full_name,
      enrollment_number: Number(formData.enrollment_number),
      college_email: formData.college_email,
      gmail_id: formData.gmail_id,
      phone_number: formData.phone_number,
      alternate_phone_number: formData.alternate_phone_number,
      cgpa: Number(formData.cgpa),
      class_12th_percentage: Number(formData.class_12th_percentage),
      class_10th_percentage: Number(formData.class_10th_percentage),
      Branch: formData.Branch,
      Backlog: formData.Backlog,
      Course: formData.Course,
      resume_drive_link: formData.resume_drive_link,
      Age: Number(formData.Age),
      gap_year: Number(formData.gap_year),
      Gender: formData.Gender,
      Batch: Number(formData.Batch),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    // Validate required fields (simple check)
    for (const [key, value] of Object.entries(formData)) {
      if (!value || value.trim() === "") {
        setError(`Please fill the required field: ${key.replace(/_/g, " ")}`);
        setLoading(false);
        return;
      }
    }
  
    const payload = preparePayload();
    await postInterestedStudent(payload);
    try {
      // Check if student exists
      await getInterestedStudentByEnrollment(payload.enrollment_number);
      // Exists => patch update
      await patchInterestedStudent(payload.enrollment_number, payload);
    } catch {
      try {
        // If not found => create new
        await postInterestedStudent(payload);
      } catch (createErr) {
        setError("Error saving profile. Please try again.");
        setLoading(false);
        return;
      }
    }

    setSuccess(true);
    setLoading(false);
    localStorage.setItem("enrollment_number", formData.enrollment_number);
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedEnrollment = localStorage.getItem("enrollment_number");
      if (!storedEnrollment) return;

      try {
        const existing = await getInterestedStudentByEnrollment(
          Number(storedEnrollment)
        );

        setFormData({
          full_name: existing.full_name ?? "",
          enrollment_number: existing.enrollment_number?.toString() ?? "",
          college_email: existing.college_email ?? "",
          gmail_id: existing.gmail_id ?? "",
          phone_number: existing.phone_number ?? "",
          alternate_phone_number: existing.alternate_phone_number ?? "",
          cgpa: existing.cgpa?.toString() ?? "",
          class_12th_percentage: existing.class_12th_percentage?.toString() ?? "",
          class_10th_percentage: existing.class_10th_percentage?.toString() ?? "",
          Branch: existing.Branch ?? "",
          Backlog: existing.Backlog ?? "",
          Course: existing.Course ?? "",
          resume_drive_link: existing.resume_drive_link ?? "",
          Age: existing.Age?.toString() ?? "",
          gap_year: existing.gap_year?.toString() ?? "",
          Gender: existing.Gender ?? "",
          Batch: existing.Batch?.toString() ?? "",
        });
      } catch {
        // No existing profile
      }
    };

    fetchData();
  }, []);

  return (
    <Container sx={{[media.st] :{ color:"primary",backgroundColor:"background.default",width:"100%", alignItems: 'stretch',mr:"20px"}}}>
      {/* <Box>
        <Navbar />
      </Box> */}
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: "#1e1e1e", color: "#fff"}}>
          <Typography variant="h5" gutterBottom>
            My Profile
          </Typography>

          {error && <Typography color="error">{error}</Typography>}
          {success && (
            <Typography color="success.main">Profile submitted successfully!</Typography>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {[
                { label: "Full Name", name: "full_name" },
                { label: "Enrollment Number", name: "enrollment_number", type: "number" },
                { label: "College Email ID", name: "college_email" },
                { label: "Gmail ID", name: "gmail_id" },
                { label: "Phone Number", name: "phone_number" },
                { label: "Alternate Phone Number", name: "alternate_phone_number" },
                { label: "CGPA", name: "cgpa", type: "string" },
                { label: "Class 12th Percentage", name: "class_12th_percentage", type: "number" },
                { label: "Class 10th Percentage", name: "class_10th_percentage", type: "number" },
                { label: "Resume Drive Link", name: "resume_drive_link" },
                { label: "Age", name: "Age", type: "number" },
                { label: "Gap Year", name: "gap_year", type: "number" },
              ].map((field) => (
                <Grid item xs={12} md={6} key={field.name}>
                  <TextField
                    required
                    fullWidth
                    label={field.label}
                    name={field.name}
                    type={field.type || "text"}
                    value={formData[field.name as keyof FormData] || ""}
                    onChange={handleChange}
                    variant="outlined"
                    sx={textFieldStyle}
                    inputProps={field.type === "number" ? { min: 0 } : undefined}
                  />
                </Grid>
              ))}

              {/* Dropdowns */}
              <Grid item xs={12} md={6} minWidth={"120px"}>
                <TextField
                  required
                  select
                  fullWidth
                  label="Branch"
                  name="Branch"
                  value={formData.Branch}
                  onChange={handleChange}
                  sx={textFieldStyle}
                >
                  {Branches.map((b) => (
                    <MenuItem key={b} value={b}>
                      {b}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6} minWidth={"180px"}>
                <TextField
                  required
                  select
                  fullWidth
                  label="Backlog"
                  name="Backlog"
                  value={formData.Backlog}
                  onChange={handleChange}
                  sx={textFieldStyle}
                >
                  {Backlog.map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6} minWidth={"180px"}>
                <TextField
                  required
                  select
                  fullWidth
                  label="Gender"
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  sx={textFieldStyle}
                >
                  {gender.map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6} minWidth={"120px"}>
                <TextField
                  required
                  select
                  fullWidth
                  label="Course"
                  name="Course"
                  value={formData.Course}
                  onChange={handleChange}
                  sx={textFieldStyle}
                >
                  {Courses.map((Course) => (
                    <MenuItem key={Course} value={Course}>
                      {Course}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6} minWidth={"120px"}>
                <TextField
                  required
                  select
                  fullWidth
                  label="Batch"
                  name="Batch"
                  value={formData.Batch}
                  onChange={handleChange}
                  sx={textFieldStyle}
                >
                  {batch.map((b) => (
                    <MenuItem key={b} value={b.toString()}>
                      {b}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Submit button */}
              <Grid item xs={12} mt={5}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{
                    minHeight: "50px",
                    backgroundColor: "#388e3c",
                    "&:hover": {
                      backgroundColor: "#388e3c",
                      boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.4)",
                    },
                  }}
                >
                  {loading ? "Saving..." : "Submit Profile"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

const textFieldStyle = {
  input: { color: "#fff" },
  label: { color: "#ccc" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#555",
    },
    "&:hover fieldset": {
      borderColor: "#aaa",
    },
    "&.Mui-focused fieldset": {
      boxShadow: "0 0 6px 2px rgba(255, 255, 255, 0.4)",
      borderColor: "#fff",
    },
  },
};
