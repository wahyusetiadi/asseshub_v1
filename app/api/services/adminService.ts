import apiConfig from "../config/api";
import { API_ENDPOINTS } from "../config/endpoint";
import { createApiMethod } from "../utils/apiUtils";

class AdminService {
  genetateAccount = createApiMethod(async (name: string, email: string) => {
    const response = await apiConfig.post(
      API_ENDPOINTS.ADMIN.GENERATE_ACCOUNT,
      {
        name,
        email,
      }
    );

    return response;
  });

  getAccount = createApiMethod(async (id: string) => {
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
