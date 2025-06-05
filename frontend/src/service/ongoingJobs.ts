// services/ongoingJobs.ts
import apiClient from "../utils/apiClient";

export interface OngoingJob {
  id: number;
  // add other fields
}

export const getOngoingJobs = async (): Promise<OngoingJob[]> => {
  const res = await apiClient.get("/ongoing-jobs");
  return res.data;
};

export const getOngoingJobById = async (id: number): Promise<OngoingJob> => {
  const res = await apiClient.get(`/ongoing-jobs/${id}`);
  return res.data;
};

export const createOngoingJob = async (data: Partial<OngoingJob>): Promise<OngoingJob> => {
  const res = await apiClient.post("/ongoing-jobs", data);
  return res.data;
};

export const updateOngoingJob = async (id: number, data: Partial<OngoingJob>): Promise<OngoingJob> => {
  const res = await apiClient.put(`/ongoing-jobs/${id}`, data);
  return res.data;
};

export const patchOngoingJob = async (id: number, data: Partial<OngoingJob>): Promise<OngoingJob> => {
  const res = await apiClient.patch(`/ongoing-jobs/${id}`, data);
  return res.data;
};

export const deleteOngoingJob = async (id: number): Promise<void> => {
  await apiClient.delete(`/ongoing-jobs/${id}`);
};
