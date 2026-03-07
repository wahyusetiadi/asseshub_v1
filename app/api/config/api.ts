import axios from "axios";
import {
  clearSession,
  getLoginRouteForPathname,
  getStoredToken,
  getStoredUser,
  isTokenExpired,
} from "@/helpers/auth";
import { handleApiError } from "../utils/errorHandler";
import { API_ENDPOINTS } from "./endpoint";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiConfig = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiConfig.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token && isTokenExpired(token)) {
      clearSession();
      return config;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiConfig.interceptors.response.use(
  (response) => {
    if (process.env.MODE === "local-test") {
      console.log(
        `[${response.config.method?.toUpperCase()}] ${response.config.url}`,
        response.data,
      );
    }
    return response;
  },
  (error) => {
    const requestUrl = error.config?.url ?? "";
    const isLoginRequest =
      requestUrl.includes(API_ENDPOINTS.AUTH.LOGIN_ADMIN) ||
      requestUrl.includes(API_ENDPOINTS.AUTH.LOGIN_USER);

    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      !isLoginRequest
    ) {
      const storedUser = getStoredUser();
      const loginRoute = getLoginRouteForPathname(
        window.location.pathname,
        storedUser?.role,
      );

      clearSession();

      if (window.location.pathname !== loginRoute) {
        window.location.replace(loginRoute);
      }
    }

    const handleError = handleApiError(error);
    return Promise.reject(handleError);
  },
);

export default apiConfig;
