import { AxiosError } from "axios";

export type ApiErrorPayload = {
  message?: string;
  error?: string;
  errors?: string[] | Record<string, string | string[]>;
};


export class ApiError extends Error {
  public status: number;
  public data: ApiErrorPayload | null;

  constructor(
    message: string,
    status: number = 500,
    data: ApiErrorPayload | null = null
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function isAxiosError<T>(
  error: unknown
): error is AxiosError<T> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error
  );
}

function extractMessage(payload: ApiErrorPayload | null | undefined): string | null {
  if (!payload) return null;

  if (typeof payload === "string") return payload;

  if (payload.message) return payload.message;
  if (payload.error) return payload.error;

  if (payload.errors) {
    if (Array.isArray(payload.errors)) {
      return payload.errors.join(", ");
    }

    const msgs: string[] = [];

    for (const [key, val] of Object.entries(payload.errors)) {
      if (Array.isArray(val)) msgs.push(`${key}: ${val.join(", ")}`);
      else msgs.push(`${key}: ${val}`);
    }

    return msgs.length ? msgs.join(" | ") : null;
  }

  return null;
}

function fallbackMessageByStatus(status: number): string {
  const map: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    413: "Payload Too Large",
    415: "Unsupported Media Type",
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
  };

  return map[status] ?? `HTTP ${status}`;
}

export function handleApiError(error: unknown): never {
  // Axios error
  if (isAxiosError<ApiErrorPayload>(error)) {
    const status = error.response?.status ?? 0;
    const data = error.response?.data ?? null;

    const message =
      extractMessage(data) ||
      fallbackMessageByStatus(status) ||
      "Request failed";

    throw new ApiError(message, status, data);
  }

  // Request dibuat tapi tidak ada response
  if (error instanceof Error && error.message === "Network Error") {
    throw new ApiError("Network error or no response from server", 0);
  }

  // Timeout
  if (
    error instanceof Error &&
    "code" in error &&
    error.code === "ECONNABORTED"
  ) {
    throw new ApiError("Request timeout", 0);
  }

  // Fallback
  if (error instanceof Error) {
    throw new ApiError(error.message, 0);
  }

  throw new ApiError("Unexpected error", 0);
}

