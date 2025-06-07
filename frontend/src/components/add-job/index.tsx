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
  Checkbox,
  ListItemText,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

import {
  createCompanyVisited,
  CompanyVisited,
} from "@/src/service/companyVisited";
import { createOngoingJob, OngoingJob } from "@/src/service/ongoingJobs";

interface AddJobDialogProps {
  onSubmit?: (data: {
    ongoingJob: OngoingJob;
    companiesVisited: CompanyVisited;
  }) => void;
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
  const [backlog, setBacklog] = useState("");

  const [stipend, setStipend] = useState("");
  const [packageLPA, setPackageLPA] = useState("");
  const [jobDescriptionLink, setJobDescriptionLink] = useState("");
  const [remarks, setRemarks] = useState("");
  const [hrContact, setHrContact] = useState("");
  const [hrMail, setHrMail] = useState("");
  const [handleBy, setHandleBy] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => {
    setOpenDialog(false);
    setErrors({});
  };

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
    if (!backlog) newErrors.backlog = "Baklog selection is required";

    if (!stipend) newErrors.stipend = "Stipend is required";
    if (!handleBy) newErrors.handleBy = "Handle By is required";
    if (!packageLPA) newErrors.packageLPA = "Package is required";
    if (!jobDescriptionLink.trim())
      newErrors.jobDescriptionLink = "Job Description Link is required";
    if (!hrMail.trim()) newErrors.hrMail = "HR Email is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fixDateField = (date?: string): string | undefined => {
    if (!date) return undefined;
    // Append time if it's a date-only string
    return date.length === 10
      ? new Date(date + "T00:00:00Z").toISOString()
      : new Date(date).toISOString();
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const ongoingJobPayload: Partial<OngoingJob> = {
      company_name: companyName,
      job_title: jobTitle,
      type: jobType,
      handleBy: handleBy,
      opportunity: opportunityType, // typo kept as per backend
      Branch: branchesEligible.join(", "),
      Course: coursesEligible.join(", "),
      min_cgpa: Number(minCGPA),
      class_10th_percentage: Number(minClass10),
      class_12th_percentage: Number(minClass12),
      deadline: fixDateField(deadline),
      bond,
      backlog,
      stipend: stipend ? Number(stipend) : undefined,
      package: packageLPA ? Number(packageLPA) : undefined,
      remarks,
      date_updated: new Date().toISOString(),
    };

    const companiesVisitedPayload: Partial<CompanyVisited> = {
      company_name: companyName,
      type: jobType,
      date: new Date().toISOString(),
      package: packageLPA ? Number(packageLPA) : undefined,
      offers: 0,
      internship: opportunityType.includes("Internship") ? "Yes" : "No",
      hr_email: hrMail,
      hr_contact: hrContact,
      status: "ongoing",
    };

    try {
      const [ongoingJobRes, companiesVisitedRes] = await Promise.all([
        createOngoingJob(ongoingJobPayload),
        createCompanyVisited(companiesVisitedPayload),
      ]);

      if (onSubmit) {
        onSubmit({
          ongoingJob: ongoingJobRes,
          companiesVisited: companiesVisitedRes,
        });
      }

      handleDialogClose();
      // Optionally show toast or snackbar here
    } catch (error: any) {
      console.error("❌ Failed to submit job info:", error);
      // Optionally display error to user
    }
  };
const handleBranchesChange = (event: SelectChangeEvent<string[]>) => {
  const {
    target: { value },
  } = event;
  setBranchesEligible(typeof value === "string" ? value.split(",") : value);
};
const handleCoursesChange = (event: SelectChangeEvent<string[]>) => {
  const value = event.target.value;
  setCoursesEligible(typeof value === "string" ? value.split(",") : value);
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
              {/* Company Name */}
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
              {/* Job Title */}
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
              {/* Branch Eligible */}
              {/* Branch Eligible */}
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
                    renderValue={(selected) =>
                      (selected as string[]).join(", ")
                    }
                  >
                    {["CSE", "ECE", "EE", "ME", "CE"].map((branch) => (
                      <MenuItem key={branch} value={branch}>
                        <Checkbox checked={branchesEligible.includes(branch)} />
                        <ListItemText primary={branch} />
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.branchesEligible}</FormHelperText>
                </FormControl>
              </Grid>
              {/* Course Eligible */}
              {/* Course Eligible */}
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
                    renderValue={(selected) =>
                      (selected as string[]).join(", ")
                    }
                  >
                    {["B.Tech", "M.Tech", "M.Sc"].map((course) => (
                      <MenuItem key={course} value={course}>
                        <Checkbox checked={coursesEligible.includes(course)} />
                        <ListItemText primary={course} />
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.coursesEligible}</FormHelperText>
                </FormControl>
              </Grid>
              {/* Min CGPA */}
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
              {/* Min Class 10 % */}
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
              {/* Min Class 12 % */}
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
              {/* Deadline */}
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
              <Grid item xs={12} sm={6} minWidth={"150px"}>
                <FormControl fullWidth error={Boolean(errors.backlog)} required>
                  <InputLabel id="backlog-label">Backlog</InputLabel>
                  <Select
                    labelId="backlog-label"
                    value={backlog}
                    label="backlog"
                    onChange={(e) => setBacklog(e.target.value)}
                  >
                    <MenuItem value="Yes">No History Backlog</MenuItem>
                    <MenuItem value="No">No Active Backlog</MenuItem>
                    <MenuItem value="No">No Critera for Backlog</MenuItem>
                  </Select>
                  <FormHelperText>{errors.backlog}</FormHelperText>
                </FormControl>
              </Grid>

              {/* Stipend */}
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
              {/* Package */}
              <Grid item xs={12} sm={6} >
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
              {/* Job Description Link */}
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
              {/* HR Contact */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="HR Contact"
                  fullWidth
                  value={hrContact}
                  onChange={(e) => setHrContact(e.target.value)}
                />
              </Grid>
              {/* HR Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="HR Email"
                  fullWidth
                  value={hrMail}
                  onChange={(e) => setHrMail(e.target.value)}
                  error={Boolean(errors.hrMail)}
                  helperText={errors.hrMail}
                  required
                />
              </Grid>
              {/* Handle By */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Handle By"
                  fullWidth
                  value={handleBy}
                  onChange={(e) => setHandleBy(e.target.value)}
                  error={Boolean(errors.handleBy)}
                  helperText={errors.handleBy}
                  required
                />
              </Grid>
              {/* Remarks */}
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
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#388e3c",
              color: "black",
              "&:hover": {
                backgroundColor: "#2e7031",
              },
            }}
            onClick={handleDialogClose}
          >
            Close
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
};

export default AddJobDialog;
