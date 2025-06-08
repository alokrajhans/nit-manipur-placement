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
import {
  getSelectedStudentByEnrollment,
  createSelectedStudent,
  updateSelectedStudent,
  SelectedStudent,
  patchSelectedStudent,
} from "@/src/service/selectedStudents";
import ShowIfAdmin from "../ShowIfAdmin";

const Branches = ["CSE", "ECE", "EE", "ME", "CE"];
const Types = ["Internship Only","Internship + PPO" ,"Fulltime + Internship","Fulltime Only"]
const yesOrno = ["Yes", "No"]

export default function StudentSelection() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    enrollment_number: "",
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

  const handleSubmit = async () => {
    const missingFields = Object.entries(formData).filter(
      ([_, value]) => value.trim() === ""
    );

    if (missingFields.length > 0) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      const enrollmentNumber = Number(formData.enrollment_number);
      const packageValue = Number(formData.package);
      let existingStudent: SelectedStudent | null = null;

      try {
        existingStudent = await getSelectedStudentByEnrollment(
          enrollmentNumber.toString()
        );
      } catch (err) {
        // Student doesn't exist — will create a new one
      }

      if (existingStudent) {
        let offers = existingStudent.offers ?? 0;

        if (offers >= 3) {
          alert("Maximum of 3 offers already recorded for this student.");
          return;
        }

        offers += 1;

        const patchPayload: Partial<SelectedStudent> = {
          enrollment_number: enrollmentNumber, // Required by model
          offers,
          [`company${offers}`]: formData.company,
          [`package${offers}`]: packageValue,
          [`type${offers}`]: formData.type,
          [`internship${offers}`]: formData.internship,
        };

        await patchSelectedStudent(enrollmentNumber.toString(), patchPayload);
        alert(`Offer #${offers} added to existing student.`);
      } else {
        await createSelectedStudent({
          enrollment_number: enrollmentNumber,
          full_name: formData.full_name,
          Branch: formData.branch,
          offers: 1,
          company1: formData.company,
          package1: packageValue,
          type1: formData.type,
          internship1: formData.internship,
        });

        alert("Student added with first offer.");
      }

      handleClose();
    } catch (error: any) {
      if (error.response) {
        console.error("Validation Error:", error.response.data);
        alert(
          "Validation error: " +
            JSON.stringify(
              error.response.data?.error?.details || error.response.data
            )
        );
      } else {
        console.error("Unexpected Error:", error);
        alert("Something went wrong.");
      }
    }
  };

  return (
    <>
      <ShowIfAdmin>
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
      </ShowIfAdmin>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Select Student Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {[
              { label: "Name", name: "full_name" },
              { label: "Enrollment No", name: "enrollment_number" },
              { label: "Company", name: "company" },
              { label: "Package", name: "package" },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  fullWidth
                  required
                  label={field.label}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                />
              </Grid>
            ))}

            {/* Branch Dropdown */}
            <Grid item xs={12} sm={6} minWidth={"120px"}>
              <TextField
                required
                select
                fullWidth
                label="Branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
              >
                {Branches.map((b) => (
                  <MenuItem key={b} value={b}>
                    {b}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
               <Grid item xs={12} sm={6} minWidth={"120px"}>
              <TextField
                required
                select
                fullWidth
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                {Types.map((b) => (
                  <MenuItem key={b} value={b}>
                    {b}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
                  <Grid item xs={12} sm={6} minWidth={"120px"}>
              <TextField
                required
                select
                fullWidth
                label="Internship"
                name="internship"
                value={formData.internship}
                onChange={handleChange}
              >
                {yesOrno.map((b) => (
                  <MenuItem key={b} value={b}>
                    {b}
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
