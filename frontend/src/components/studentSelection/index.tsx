/* eslint-disable */
"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

export default function StudentSelection() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    enrollment: "",
    branch: "",
    company: "",
    package: "",
    type: "",
    internship: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    const missingFields = Object.entries(formData).filter(
      ([_, value]) => value.trim() === ""
    );

    if (missingFields.length > 0) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    console.log("Submitted Data:", formData);
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          backgroundColor: "#388e3c",
          color: "black",
          "&:hover": {
            backgroundColor: "#2e7031",
          },
        }}
      >
        Add Selected Student
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Select Student Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {[
              { label: "Name", name: "name" },
              { label: "Enrollment No", name: "enrollment" },
              { label: "Branch", name: "branch" },
              { label: "Company", name: "company" },
              { label: "Package", name: "package" },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  fullWidth
                  required
                  label={field.label}
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                />
              </Grid>
            ))}

            {/* Type Select */}
            <Grid item xs={12} sm={6} minWidth={"180px"}>
              <TextField
                select
                fullWidth
                required
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                {[
                  "Internship",
                  "Internship + PPO",
                  "Fulltime",
                  "Full time + Internship",
                ].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Internship Select */}
            <Grid item xs={12} sm={6} minWidth={"180px"}>
              <TextField
                select
                fullWidth
                required
                label="Internship"
                name="internship"
                value={formData.internship}
                onChange={handleChange}
              >
                {["Yes", "No"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              backgroundColor: "#388e3c",
              color: "black",
              "&:hover": {
                backgroundColor: "#2e7031",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#388e3c",
              color: "black",
              "&:hover": {
                backgroundColor: "#2e7031",
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
