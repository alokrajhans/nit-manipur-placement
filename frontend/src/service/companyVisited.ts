// services/companiesVisited.ts
import apiClient from "../utils/apiClient";

export interface CompanyVisited {
  id?: number;
  company_name?: string;
  type?: string;
  date?: string; // date as ISO string
  package?: number;
  offers?: number;
  internship?: string;
  hr_email?: string;
  hr_contact?: string;
  status?: string;
}

export const getCompaniesVisited = async (): Promise<CompanyVisited[]> => {
  const res = await apiClient.get("/companies-visited");
  return res.data;
};

export const getCompanyVisitedById = async (id: number): Promise<CompanyVisited> => {
  const res = await apiClient.get(`/companies-visited/${id}`);
  return res.data;
};

export const createCompanyVisited = async (
  data: Partial<CompanyVisited>
): Promise<CompanyVisited> => {
  const res = await apiClient.post("/companies-visited", data);
  return res.data;
};

export const updateCompanyVisited = async (
  id: number,
  data: Partial<CompanyVisited>
): Promise<CompanyVisited> => {
  const res = await apiClient.put(`/companies-visited/${id}`, data);
  return res.data;
};

export const patchCompanyVisited = async (
  id: number,
  data: Partial<CompanyVisited>
): Promise<CompanyVisited> => {
  const res = await apiClient.patch(`/companies-visited/${id}`, data);
  return res.data;
};

export const deleteCompanyVisited = async (id: number): Promise<void> => {
  await apiClient.delete(`/companies-visited/${id}`);
};
