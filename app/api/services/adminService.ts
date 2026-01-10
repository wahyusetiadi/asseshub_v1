import apiConfig from "../config/api";
import { API_ENDPOINTS } from "../config/endpoint";
import { createApiMethod } from "../utils/apiUtils";

class AdminService {
  generateAccount = createApiMethod(
    async (name: string, email: string, positionId?: string) => {
      const response = await apiConfig.post(
        API_ENDPOINTS.ADMIN.GENERATE_ACCOUNT,
        {
          name,
          email,
          positionId,
        }
      );

      return response;
    }
  );

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

  generatePositions = createApiMethod(async (name: string) => {
    const response = await apiConfig.post(
      API_ENDPOINTS.POSITION.GENERATE_POSITION,
      {
        name,
      }
    );

    return response;
  });

  getAllPositions = createApiMethod(async () => {
    const response = await apiConfig.get(
      API_ENDPOINTS.POSITION.GET_ALL_POSITIONS
    );
    return response;
  });

  sendInvitation = createApiMethod(
    async (data: { examId: string; userIds: string[] }) => {
      const response = await apiConfig.post(
        API_ENDPOINTS.ADMIN.SEND_INVITATIONS,
        {
          examId: data.examId,
          userIds: data.userIds,
        }
      );
      return response;
    }
  );
}

const adminService = new AdminService();
export default adminService;
