import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Replace with your LoopBack API base URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Optionally add interceptors for auth token, error handling, etc.

export default apiClient;
