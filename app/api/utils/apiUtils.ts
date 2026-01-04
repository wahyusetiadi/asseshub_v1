import { AxiosResponse } from "axios";

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export const createQueryString = (params: QueryParams): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

export type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

export type ApiEnvelope<T> = {
  data: T;
  message?: string;
};

export const handleApiResponse = <T>(
  response: AxiosResponse<T>
): ApiResponse<T> => {
  return {
    data: response.data,
    status: response.status,
    message: response.statusText || "Success",
  };
};

export const createApiMethod =
  <Args extends unknown[], T>(
    apiCall: (...args: Args) => Promise<AxiosResponse<T>>
  ) =>
  async (...args: Args): Promise<ApiResponse<T>> => {
    try {
      const response = await apiCall(...args);
      return handleApiResponse<T>(response);
    } catch (error) {
      console.error("createApiMethod - error:", error);
      throw error;
    }
  };
