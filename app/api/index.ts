// index.ts (root)

export { apiService } from "./services";

export { ApiError } from "./utils/errorHandler";
export { createQueryString } from "./utils/apiUtils";
export { default as api } from "./config/api";
export { API_ENDPOINTS } from "./config/endpoint";

import { apiService } from "./services";
export default apiService;
