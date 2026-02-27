// src/service/appliedJobs.ts
import apiClient from "../utils/apiClient";

export interface AppliedJob {
  id?: number;
  company_name: string;
  enrollment_number?: string;
}

// Create a new application (user applies to a company)
export const createAppliedJob = async (
  data: Partial<AppliedJob>
): Promise<{ message: string }> => {
  // console.log("ye Le", data);
  const res = await apiClient.post("/applied-jobs", data);
  return res.data;
};

// Get all applications for a given company_name
export const getAppliedJobsByCompany = async (
  company_name: string
): Promise<AppliedJob[]> => {
  const res = await apiClient.get(`/applied-jobs/company/${encodeURIComponent(company_name)}`);
  return res.data;
};

// Get all applications (enrollment_number + company_name)
export const getAllAppliedJobs = async (): Promise<AppliedJob[]> => {
  const res = await apiClient.get("/applied-jobs");
  return res.data;
};

// Delete all applied job entries for a given company_name (all users)
export const deleteAppliedJobsByCompany = async (
  company_name: string
): Promise<{ message: string }> => {
  const res = await apiClient.delete(`/applied-jobs/company/${encodeURIComponent(company_name)}`);
  return res.data;
};

// (Optional) Get a single applied job by ID
export const getAppliedJobById = async (id: number): Promise<AppliedJob> => {
  const res = await apiClient.get(`/applied-jobs/${id}`);
  return res.data;
};

// (Optional) Delete an applied job entry by ID
export const deleteAppliedJob = async (id: number): Promise<void> => {
  await apiClient.delete(`/applied-jobs/${id}`);
};
