export const API_ENDPOINTS = {
  AUTH: {
    LOGIN_ADMIN: "/auth/login/admin",
    LOGIN_USER: "/auth/login/user",
    REGISTER_ADMIN: "/auth/register/admin",
    GET_ME: "/auth/me",
  },

  ADMIN: {
    //Account
    GENERATE_ACCOUNT: "/admin/accounts",
    GET_ACCOUNT: (id: string) => `/admin/accounts/${id}`,
    GET_ALL_CANDIDATES: "/admin/accounts",
    UPDATE_ACCOUNT: (id: string) => `/admin/accounts/${id}`,
    SEND_INVITATIONS: `/admin/accounts/invitation`,
    DELETE_ACCOUNT: (id: string) => `/admin/accounts/${id}`,

    //Exams
    GENERATE_EXAMS: "/admin/exams",
    UPDATE_EXAM: (id: string) => `/admin/exams/${id} `,
    GET_EXAM: (id: string) => `/admin/exams/${id}`,
    GET_ALL_EXAMS: "/admin/exams",

    //Questions
    GENERATE_QUESTIONS: (id: string) => `/admin/exams/${id}/questions`,
    GET_QUESTION: (examId: string) => `/admin/exams/${examId}/questions`,
    UPDATE_QUESTION: (id: string) => `/admin/questions/${id}`,
    DELETE_QUESTION: (id: string) => `admin/questions/${id}`,

    //Options
    GENERATE_OPTIONS: (questionId: string) =>
      `/admin/questions/${questionId}/options`,
    UPDATE_OPTION: (optionId: string) => `/admin/options/${optionId}`,
    DELETE_OPTION: (optionId: string) => `/admin/options/${optionId}`,

    //Results (Admin Only)
    GET_ALL_RESULTS: "/admin/exams/candidates/results",
  },

  USER: {
    GET_QUESTION: (id: string) => `/user/exam/${id}/questions`,
    GET_STATUS: (id: string) => `/user/exam/${id}/status`,
    QUESTION_ANSWER: "/user/exam/questions/answers",
    START_EXAM: "/user/exam/start",
    FINISH_EXAM: "/user/exam/submit",
    ANSWER: (id: string) => `/user/exam/${id}/question/answer`,
  },

  POSITION: {
    GENERATE_POSITION: "/admin/positions",
    GET_ALL_POSITIONS: "/admin/positions",
  },
};
