import apiConfig from "../config/api";
import { API_ENDPOINTS } from "../config/endpoint";
import { createApiMethod } from "../utils/apiUtils";

class AdminService {
  generateAccount = createApiMethod(async (name: string, email: string) => {
    const response = await apiConfig.post(
      API_ENDPOINTS.ADMIN.GENERATE_ACCOUNT,
      {
        name,
        email,
      }
    );

    return response;
  });

  getAllCandicates = createApiMethod(async () => {
    return apiConfig.get(API_ENDPOINTS.ADMIN.GET_ALL_CANDIDATES);
  });

  getAccountById = createApiMethod(async (id: string) => {
    const token = localStorage.getItem("token");
    return apiConfig.get(API_ENDPOINTS.ADMIN.GET_ACCOUNT(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });
}

const adminService = new AdminService();
export default adminService;
