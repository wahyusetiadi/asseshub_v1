import apiConfig from "../config/api";
import { API_ENDPOINTS } from "../config/endpoint";
import { createApiMethod } from "../utils/apiUtils";

class AuthService {
  loginAdmin = createApiMethod(async (username: string, password: string) => {
    const response = await apiConfig.post(API_ENDPOINTS.AUTH.LOGIN_ADMIN, {
      username,
      password,
    });

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response;
  });

  loginUser = createApiMethod(async (username: string, password: string) => {
    const response = await apiConfig.post(API_ENDPOINTS.AUTH.LOGIN_USER, {
      username,
      password,
    });

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response;
  });

  getMe = createApiMethod(async () => {
    const token = localStorage.getItem("token");
    return apiConfig.get(API_ENDPOINTS.AUTH.GET_ME, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });
}

const authService = new AuthService();
export default authService;
