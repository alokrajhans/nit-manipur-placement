// services/ping.ts
import apiClient from "../utils/apiClient";

export const ping = async (): Promise<string> => {
  const res = await apiClient.get("/ping");
  return res.data;
};
