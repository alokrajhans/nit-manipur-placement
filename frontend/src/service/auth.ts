import apiClient from "../utils/apiClient";

// src/service/auth.ts
export interface AuthPayload {
    enrollment_number: string;
    password: string;
    role?: number;
  }
  
  export interface AuthResponse {
    token?: string;
    message?: string;
    role?: number;
    error?: {
      message: string;
    };
  }
  
  // ✅ Register a new user
  export const registerUser = async (payload: AuthPayload): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/register', payload);
      return response.data;
    } catch (error: any) {
      // Axios error handling
      if (error.response?.data) {
        return { error: { message: error.response.data.error?.message || error.response.data.message || 'Registration failed' }};
      }
      return { error: { message: error.message || 'Registration failed' } };
    }
  };
  
  // ✅ Login user
// ✅ auth.ts
export const loginUser = async (payload: AuthPayload): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/login', payload);
      // console.log('Login response:', response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return {
          error: {
            message:
              error.response.data.error?.message ||
              error.response.data.message ||
              'Login failed',
          },
        };
      }
      return { error: { message: error.message || 'Login failed' } };
    }
  };
  
  
  // ✅ Logout user (if you're handling token client-side)
  export const logoutUser = () => {
    localStorage.removeItem('jwtToken');
  };
  
  // ✅ Utility to get stored token
  export const getToken = (): string | null => {
    return localStorage.getItem('jwtToken');
  };
  
  // ✅ Check if user is logged in
  export const isLoggedIn = (): boolean => {
    return !!localStorage.getItem('jwtToken');
  };
  