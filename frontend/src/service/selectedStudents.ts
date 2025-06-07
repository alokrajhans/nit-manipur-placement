// services/selectedStudents.ts
import apiClient from "../utils/apiClient";

export interface SelectedStudent {
  enrollment_number: number;
  full_name: string;
  Branch: string;
  company1?: string;
  package1?: number;
  type1?: string;
  internship1?: string;
  offers?: number;
  company2?: string;
  package2?: number;
  type2?: string;
  internship2?: string;
  company3?: string;
  package3?: number;
  type3?: string;
  internship3?: string;
}

export const getSelectedStudents = async (): Promise<SelectedStudent[]> => {
  const res = await apiClient.get("/selected-students");
  return res.data;
};

export const getSelectedStudentByEnrollment = async (
  enrollment_number: string
): Promise<SelectedStudent> => {
  const res = await apiClient.get(`/selected-students/${enrollment_number}`);
  return res.data;
};

export const createSelectedStudent = async (
  data: Partial<SelectedStudent>
): Promise<SelectedStudent> => {
  const res = await apiClient.post("/selected-students", data);
  return res.data;
};

export const updateSelectedStudent = async (
  enrollment_number: string,
  data: Partial<SelectedStudent>
): Promise<SelectedStudent> => {
  const res = await apiClient.put(`/selected-students/${enrollment_number}`, data);
  return res.data;
};

export const patchSelectedStudent = async (
  enrollment_number: string,
  data: Partial<SelectedStudent>
): Promise<SelectedStudent> => {
  const res = await apiClient.patch(`/selected-students/${enrollment_number}`, data);
  return res.data;
};

export const deleteSelectedStudent = async (
  enrollment_number: string
): Promise<void> => {
  await apiClient.delete(`/selected-students/${enrollment_number}`);
};
