export const API_ENDPOINTS = {
  AUTH: {
    LOGIN_ADMIN: "/auth/login/admin",
    LOGIN_USER: "/auth/login/user",
    REGISTER_ADMIN: "/auth/register/admin",
    GET_ME: "/auth/me",
  },
  ADMIN: {
    GENERATE_ACCOUNT: "/admin/account",
    GET_ACCOUNT: (id: string) => `/admin/account/${id}`,

    GENERATE_EXAMS: "/admin/exams",
    GET_EXAM: (id: string) => `/admin/exams/${id}`,
    GET_ALL_EXAMS: "/admin/exams",
    GENERATE_QUESTIONS: (id: string) => `/admin/exams/${id}/questions`,
    
    GENERATE_OPTIONS: (questionId: string) =>
      `/admin/questions/${questionId}/options`,
    GET_QUESTION: (id: string) => `/admin/exams/${id}/questions`,
  },
  USER: {},
};
