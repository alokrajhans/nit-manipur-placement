export interface OngoingJobWithFlag {
  id?: number;
  company_name?: string;
  job_title?: string;
  backlog?: string;
  type?: string;
  opportunity?: string;
  Branch?: string;
  package?: number;
  remarks?: string;
  jobDescriptionLink?: string | null;
  Course?: string;
  handleBy?: string;
  min_cgpa?: number;
  deadline?: string;
  class_12th_percentage?: number;
  class_10th_percentage?: number;
  bond?: string;
  stipend?: number;
  date_updated?: string;
  isApplied: number;
}
