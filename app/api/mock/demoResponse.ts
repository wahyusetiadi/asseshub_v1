import type { ApiResponse } from "../utils/apiUtils";

export type DemoApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export const demoOk = <T>(
  data: T,
  message: string = "OK",
  status: number = 200
): ApiResponse<DemoApiEnvelope<T>> => ({
  data: { success: true, message, data },
  status,
  message,
});

