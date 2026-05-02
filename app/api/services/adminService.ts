import apiConfig from "../config/api";
import { API_ENDPOINTS } from "../config/endpoint";
import { createApiMethod } from "../utils/apiUtils";
import { isDemoMode } from "@/helpers/demo";
import { demoAdminService } from "../mock/demoServices";

class AdminService {
  private generateAccountReal = createApiMethod(
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

  private updatedAccountReal = createApiMethod(
    async (id: string, name?: string, email?: string, position?: string) => {
      const response = await apiConfig.patch(
        API_ENDPOINTS.ADMIN.UPDATE_ACCOUNT(id),
        {
          name,
          email,
          position,
        }
      );
      return response;
    }
  );

  private deleteAccountReal = createApiMethod(async (id: string) => {
    const response = await apiConfig.delete(
      API_ENDPOINTS.ADMIN.DELETE_ACCOUNT(id)
    );
    return response;
  });

  private getAllCandicatesReal = createApiMethod(async () => {
    return apiConfig.get(API_ENDPOINTS.ADMIN.GET_ALL_CANDIDATES);
  });

  private getAccountByIdReal = createApiMethod(async (id: string) => {
    const token = localStorage.getItem("token");
    return apiConfig.get(API_ENDPOINTS.ADMIN.GET_ACCOUNT(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  private generatePositionsReal = createApiMethod(async (name: string) => {
    const response = await apiConfig.post(
      API_ENDPOINTS.POSITION.GENERATE_POSITION,
      {
        name,
      }
    );

    return response;
  });

  private getAllPositionsReal = createApiMethod(async () => {
    const response = await apiConfig.get(
      API_ENDPOINTS.POSITION.GET_ALL_POSITIONS
    );
    return response;
  });

  private sendInvitationReal = createApiMethod(
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

  generateAccount = async (name: string, email: string, positionId?: string) => {
    if (isDemoMode()) return demoAdminService.generateAccount(name, email, positionId);
    return this.generateAccountReal(name, email, positionId);
  };

  updatedAccount = async (
    id: string,
    name?: string,
    email?: string,
    position?: string,
  ) => {
    if (isDemoMode()) return demoAdminService.updatedAccount(id, name, email, position);
    return this.updatedAccountReal(id, name, email, position);
  };

  deleteAccount = async (id: string) => {
    if (isDemoMode()) return demoAdminService.deleteAccount(id);
    return this.deleteAccountReal(id);
  };

  getAllCandicates = async () => {
    if (isDemoMode()) return demoAdminService.getAllCandicates();
    return this.getAllCandicatesReal();
  };

  getAccountById = async (id: string) => {
    if (isDemoMode()) return demoAdminService.getAccountById(id);
    return this.getAccountByIdReal(id);
  };

  generatePositions = async (name: string) => {
    if (isDemoMode()) return demoAdminService.generatePositions(name);
    return this.generatePositionsReal(name);
  };

  getAllPositions = async () => {
    if (isDemoMode()) return demoAdminService.getAllPositions();
    return this.getAllPositionsReal();
  };

  sendInvitation = async (data: { examId: string; userIds: string[] }) => {
    if (isDemoMode()) return demoAdminService.sendInvitation(data);
    return this.sendInvitationReal(data);
  };
}

const adminService = new AdminService();
export default adminService;
