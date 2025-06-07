// // services/user.ts
// import apiClient from "../utils/apiClient";

// export interface User {
//   enrollment_number: string;
//   // add other user fields
// }

// export interface LoginPayload {
//   enrollment_number: string;
//   password: string;
// }

// export interface LoginResponse {
//   token: string;
//   // other response fields
// }

// export const loginUser = async (data: LoginPayload): Promise<LoginResponse> => {
//   const res = await apiClient.post("/login", data);
//   return res.data;
// };

// export const registerUser = async (data: Partial<User & { password: string }>): Promise<User> => {
//   const res = await apiClient.post("/register", data);
//   return res.data;
// };

// export const getUserProfile = async (token: string): Promise<User> => {
//   const res = await apiClient.get(`/me/${token}`);
//   return res.data;
// };
