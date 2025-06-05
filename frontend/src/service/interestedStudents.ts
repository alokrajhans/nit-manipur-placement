// services/interestedStudents.ts
import apiClient from "../utils/apiClient";

// Use backend-compatible interface directly
export interface InterestedStudent {
  enrollment_number: number;
  full_name?: string;
  college_email?: string;
  gmail_id?: string;
  phone_number?: string;
  alternate_phone_number?: string;
  cgpa?: number;
  class_12th_percentage?: number;
  class_10th_percentage?: number;
  resume_drive_link?: string;
  Age?: number;
  gap_year?: number;
  Branch?: string;
  Backlog?: string;
  Gender?: string;
  Course?: string;
  Batch?: number;
}

// Get all interested students
export const getInterestedStudents = async (): Promise<InterestedStudent[]> => {
  const res = await apiClient.get("/interested-students");
  return res.data;
};

// Get a single interested student by enrollment number
export const getInterestedStudentByEnrollment = async (
  enrollmentNumber: number
): Promise<InterestedStudent> => {
  const res = await apiClient.get(`/interested-students/${enrollmentNumber}`);
  return res.data;
};

// Create a new interested student
export const createInterestedStudent = async (
  data: InterestedStudent
): Promise<InterestedStudent> => {
  const res = await apiClient.post("/interested-students", data);
  return res.data;
};

// Another named function for POST (for clarity)
export const postInterestedStudent = async (
  data: InterestedStudent
): Promise<InterestedStudent> => {
  const res = await apiClient.post("/interested-students", data);
  return res.data;
};

// Full replace an interested student
export const updateInterestedStudent = async (
  enrollmentNumber: number,
  data: InterestedStudent
): Promise<InterestedStudent> => {
  const res = await apiClient.put(`/interested-students/${enrollmentNumber}`, data);
  return res.data;
};

// Partial update an interested student
export const patchInterestedStudent = async (
  enrollmentNumber: number,
  data: Partial<InterestedStudent>
): Promise<InterestedStudent> => {
  const res = await apiClient.patch(`/interested-students/${enrollmentNumber}`, data);
  return res.data;
};

// Delete an interested student
export const deleteInterestedStudent = async (
  enrollmentNumber: number
): Promise<void> => {
  await apiClient.delete(`/interested-students/${enrollmentNumber}`);
};
