/* eslint-disable */
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

interface AddJobDialogProps {
  // Optionally, you can add props here if you want to customize behavior
  onSubmit?: (data: any) => void; // callback when form submits
}

const AddJobDialog: React.FC<AddJobDialogProps> = ({ onSubmit }) => {
  const [openDialog, setOpenDialog] = useState(false);

  // Form states
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [branchesEligible, setBranchesEligible] = useState<string[]>([]);
  const [coursesEligible, setCoursesEligible] = useState<string[]>([]);
  const [minCGPA, setMinCGPA] = useState("");
  const [minClass10, setMinClass10] = useState("");
  const [minClass12, setMinClass12] = useState("");
  const [deadline, setDeadline] = useState("");
  const [opportunityType, setOpportunityType] = useState("");
  const [bond, setBond] = useState("");
  const [stipend, setStipend] = useState("");
  const [packageLPA, setPackageLPA] = useState("");
  const [jobDescriptionLink, setJobDescriptionLink] = useState("");
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => {
    setOpenDialog(false);
    setErrors({});
  };

  const handleBranchesChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setBranchesEligible(event.target.value as string[]);
  };

  const handleCoursesChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setCoursesEligible(event.target.value as string[]);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!companyName.trim()) newErrors.companyName = "Company Name is required";
    if (!jobTitle.trim()) newErrors.jobTitle = "Job Title is required";
    if (!jobType) newErrors.jobType = "Job Type is required";
    if (branchesEligible.length === 0)
      newErrors.branchesEligible = "Select at least one branch";
    if (coursesEligible.length === 0)
      newErrors.coursesEligible = "Select at least one course";
    if (!minCGPA) newErrors.minCGPA = "Min CGPA is required";
    if (!minClass10) newErrors.minClass10 = "Min Class 10 % is required";
    if (!minClass12) newErrors.minClass12 = "Min Class 12 % is required";
    if (!deadline) newErrors.deadline = "Deadline is required";
    if (!opportunityType)
      newErrors.opportunityType = "Opportunity Type is required";
    if (!bond) newErrors.bond = "Bond selection is required";
    if (!stipend) newErrors.stipend = "Stipend is required";
    if (!packageLPA) newErrors.packageLPA = "Package is required";
    if (!jobDescriptionLink.trim())
      newErrors.jobDescriptionLink = "Job Description Link is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const formData = {
      companyName,
      jobTitle,
      jobType,
      branchesEligible,
      coursesEligible,
      minCGPA,
      minClass10,
      minClass12,
      deadline,
      opportunityType,
      bond,
      stipend,
      packageLPA,
      jobDescriptionLink,
      remarks,
    };

    if (onSubmit) {
      onSubmit(formData);
    }

    handleDialogClose();
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#388e3c",
          "&:hover": { backgroundColor: "#2e7d32" },
        }}
        onClick={handleDialogOpen}
      >
        Add Job
      </Button>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>List A Job</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Company Name"
                  fullWidth
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  error={Boolean(errors.companyName)}
                  helperText={errors.companyName}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Job Title"
                  fullWidth
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  error={Boolean(errors.jobTitle)}
                  helperText={errors.jobTitle}
                  required
                />
              </Grid>

              {/* Job Type */}
              <Grid item xs={12} sm={6} minWidth={"120px"}>
                <FormControl fullWidth error={Boolean(errors.jobType)} required>
                  <InputLabel id="job-type-label">Job Type</InputLabel>
                  <Select
                    labelId="job-type-label"
                    value={jobType}
                    label="Job Type"
                    onChange={(e) => setJobType(e.target.value)}
                  >
                    <MenuItem value="IT">IT</MenuItem>
                    <MenuItem value="Core">Core</MenuItem>
                  </Select>
                  <FormHelperText>{errors.jobType}</FormHelperText>
                </FormControl>
              </Grid>

              {/* Branch Eligible MultiSelect */}
              <Grid item xs={12} sm={6} minWidth={"180px"}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.branchesEligible)}
                  required
                >
                  <InputLabel id="branch-eligible-label">
                    Branch Eligible
                  </InputLabel>
                  <Select
                    labelId="branch-eligible-label"
                    multiple
                    value={branchesEligible}
                    onChange={handleBranchesChange}
                    label="Branch Eligible"
                    renderValue={(selected) =>
                      (selected as string[]).join(", ")
                    }
                  >
                    {["CSE", "ECE", "EE", "ME", "CE"].map((branch) => (
                      <MenuItem key={branch} value={branch}>
                        {branch}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.branchesEligible}</FormHelperText>
                </FormControl>
              </Grid>

              {/* Course Eligible MultiSelect */}
              <Grid item xs={12} sm={6} minWidth={"180px"}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.coursesEligible)}
                  required
                >
                  <InputLabel id="course-eligible-label">
                    Course Eligible
                  </InputLabel>
                  <Select
                    labelId="course-eligible-label"
                    multiple
                    value={coursesEligible}
                    onChange={handleCoursesChange}
                    label="Course Eligible"
                    renderValue={(selected) =>
                      (selected as string[]).join(", ")
                    }
                  >
                    {["B.Tech", "M.Tech", "M.Sc"].map((course) => (
                      <MenuItem key={course} value={course}>
                        {course}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.coursesEligible}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Min CGPA"
                  type="number"
                  fullWidth
                  value={minCGPA}
                  onChange={(e) => setMinCGPA(e.target.value)}
                  error={Boolean(errors.minCGPA)}
                  helperText={errors.minCGPA}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Min Class 10 %"
                  type="number"
                  fullWidth
                  value={minClass10}
                  onChange={(e) => setMinClass10(e.target.value)}
                  error={Boolean(errors.minClass10)}
                  helperText={errors.minClass10}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Min Class 12 %"
                  type="number"
                  fullWidth
                  value={minClass12}
                  onChange={(e) => setMinClass12(e.target.value)}
                  error={Boolean(errors.minClass12)}
                  helperText={errors.minClass12}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Deadline"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  error={Boolean(errors.deadline)}
                  helperText={errors.deadline}
                  required
                />
              </Grid>

              {/* Opportunity Type */}
              <Grid item xs={12} sm={6} minWidth={"180px"}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.opportunityType)}
                  required
                >
                  <InputLabel id="opportunity-type-label">
                    Opportunity Type
                  </InputLabel>
                  <Select
                    labelId="opportunity-type-label"
                    value={opportunityType}
                    label="Opportunity Type"
                    onChange={(e) => setOpportunityType(e.target.value)}
                  >
                    <MenuItem value="Internship Only">Internship Only</MenuItem>
                    <MenuItem value="Internship + PPO">
                      Internship + PPO
                    </MenuItem>
                    <MenuItem value="Fulltime+Internship">
                      Fulltime+Internship
                    </MenuItem>
                    <MenuItem value="Fulltime Only">Fulltime Only</MenuItem>
                  </Select>
                  <FormHelperText>{errors.opportunityType}</FormHelperText>
                </FormControl>
              </Grid>

              {/* Bond */}
              <Grid item xs={12} sm={6} minWidth={"120px"}>
                <FormControl fullWidth error={Boolean(errors.bond)} required>
                  <InputLabel id="bond-label">Bond</InputLabel>
                  <Select
                    labelId="bond-label"
                    value={bond}
                    label="Bond"
                    onChange={(e) => setBond(e.target.value)}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                  <FormHelperText>{errors.bond}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Stipend (if applicable)"
                  fullWidth
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  error={Boolean(errors.stipend)}
                  helperText={errors.stipend}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Package (LPA)"
                  fullWidth
                  value={packageLPA}
                  onChange={(e) => setPackageLPA(e.target.value)}
                  error={Boolean(errors.packageLPA)}
                  helperText={errors.packageLPA}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Job Description Link"
                  fullWidth
                  value={jobDescriptionLink}
                  onChange={(e) => setJobDescriptionLink(e.target.value)}
                  error={Boolean(errors.jobDescriptionLink)}
                  helperText={errors.jobDescriptionLink}
                  required
                />
              </Grid>
              <Grid item xs={12} minWidth={"500px"}>
                <TextField
                  label="Remarks"
                  fullWidth
                  multiline
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" color="error" onClick={handleDialogClose}>
            Close
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddJobDialog;
