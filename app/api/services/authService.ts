import apiConfig from "../config/api";
import { API_ENDPOINTS } from "../config/endpoint";
import { createApiMethod } from "../utils/apiUtils";
import { setStoredToken } from "@/helpers/auth";
import { isDemoMode } from "@/helpers/demo";
import { demoGetMe, demoLoginAdmin, demoLoginUser } from "../mock/demoAuth";

class AuthService {
  private loginAdminReal = createApiMethod(
    async (username: string, password: string) => {
    const response = await apiConfig.post(API_ENDPOINTS.AUTH.LOGIN_ADMIN, {
      username,
      password,
    });

    if (response.data?.token) {
      setStoredToken(response.data.token);
    }

    return response;
    },
  );

  private loginUserReal = createApiMethod(
    async (username: string, password: string) => {
    const response = await apiConfig.post(API_ENDPOINTS.AUTH.LOGIN_USER, {
      username,
      password,
    });

    if (response.data?.token) {
      setStoredToken(response.data.token);
    }
    return response;
    },
  );

  private getMeReal = createApiMethod(async () => {
    return apiConfig.get(API_ENDPOINTS.AUTH.GET_ME);
  });

  loginAdmin = async (username: string, password: string) => {
    if (isDemoMode()) return demoLoginAdmin(username, password);
    return this.loginAdminReal(username, password);
  };

  loginUser = async (username: string, password: string) => {
    if (isDemoMode()) return demoLoginUser(username, password);
    return this.loginUserReal(username, password);
  };

  getMe = async () => {
    if (isDemoMode()) return demoGetMe();
    return this.getMeReal();
  };
}

const authService = new AuthService();
export default authService;
