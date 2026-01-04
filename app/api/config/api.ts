import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiConfig = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiConfig.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiConfig.interceptors.response.use(
  (response) => {
    if (process.env.MODE === "local-test") {
      console.log(
        `[${response.config.method?.toUpperCase()}] ${response.config.url}`,
        response.data
      );
    }
    return response;
  },
  (error) => {
    const handleError = handleApiError(error);
    return Promise.reject(handleError);
  }
);

export default apiConfig;
