export const API_ENDPOINTS = {
  AUTH: {
    LOGIN_ADMIN: "/auth/login/admin",
    LOGIN_USER: "/auth/login/user",
    REGISTER_ADMIN: "/auth/register/admin",
    GET_ME: "/auth/me",
  },

  ADMIN: {
    //Account
    GENERATE_ACCOUNT: "/admin/account",
    GET_ACCOUNT: (id: string) => `/admin/account/${id}`,
    GET_ALL_CANDIDATES: "admin/accounts",

    //Exams
    GENERATE_EXAMS: "/admin/exams",
    UPDATE_EXAM: (id: string) => `/admin/exams/${id} `,
    GET_EXAM: (id: string) => `/admin/exams/${id}`,
    GET_ALL_EXAMS: "/admin/exams",

    //Questions
    GENERATE_QUESTIONS: (id: string) => `/admin/exams/${id}/questions`,
    GET_QUESTION: (examId: string) => `/admin/exams/${examId}/questions`,
    UPDATE_QUESTION: (id: string) => `/admin/questions/${id}`,

    //Options
    GENERATE_OPTIONS: (questionId: string) =>
      `/admin/questions/${questionId}/options`,
    UPDATE_OPTION: (optionId: string) => `/admin/options/${optionId}`,
  },

  USER: {
    GET_QUESTION: (id: string) => `/user/exam/${id}/questions`,
    GET_STATUS: (id: string) => `/user/exam/${id}/status`,
    QUESTION_ANSWER: "/user/exam/questions/answers",
    START_EXAM: "/user/exam/start",
    FINISH_EXAM: "/user/exam/submit",
    ANSWER: (id:string) => `/user/exam/${id}/answer`,
  },
};
