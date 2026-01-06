import apiConfig from "../config/api";
import { API_ENDPOINTS } from "../config/endpoint";
import { createApiMethod } from "../utils/apiUtils";

interface AnswerPayload {
  questionId: string;
  optionId: string;
}

class UserService {
  getQuestion = createApiMethod(async (id: string) => {
    const response = await apiConfig.get(API_ENDPOINTS.USER.GET_QUESTION(id));
    return response;
  });

  questionAnswer = createApiMethod(async () => {
    return await apiConfig.get(API_ENDPOINTS.USER.QUESTION_ANSWER);
  });

  checkStatus = createApiMethod(async (id: string) => {
    const response = await apiConfig.get(API_ENDPOINTS.USER.GET_STATUS(id));
    return response;
  });

  startExam = createApiMethod(async (examId: string) => {
    return await apiConfig.post(API_ENDPOINTS.USER.START_EXAM, {
      examId,
    });
  });

  finishExam = createApiMethod(async (examId: string) => {
    return await apiConfig.post(API_ENDPOINTS.USER.FINISH_EXAM, {
      examId,
    });
  });

  answerQuestion = createApiMethod(async (id: string, data: AnswerPayload) => {
    const response = await apiConfig.post(API_ENDPOINTS.USER.ANSWER(id), {
      questionId: data.questionId,
      optionId: data.optionId,
    });
    return response;
  });
}

const userService = new UserService();
export default userService;
