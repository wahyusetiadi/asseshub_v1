// app/api/services/userService.ts
import apiConfig from "../config/api";
import { API_ENDPOINTS } from "../config/endpoint";
import { createApiMethod } from "../utils/apiUtils";
import { isDemoMode } from "@/helpers/demo";
import { demoUserService } from "../mock/demoServices";

interface AnswerPayload {
  questionId: string;
  optionId: string;
}

class UserService {
  private getQuestionReal = createApiMethod(async (id: string) => {
    const response = await apiConfig.get(API_ENDPOINTS.USER.GET_QUESTION(id));
    return response;
  });

  // ✅ Method untuk fetch jawaban yang sudah tersimpan
  private getQuestionAnswersReal = createApiMethod(async (examId: string) => {
    return await apiConfig.get(API_ENDPOINTS.USER.QUESTION_ANSWER);
  });

  private checkStatusReal = createApiMethod(async (id: string) => {
    const response = await apiConfig.get(API_ENDPOINTS.USER.GET_STATUS(id));
    return response;
  });

  private startExamReal = createApiMethod(async (examId: string) => {
    return await apiConfig.post(API_ENDPOINTS.USER.START_EXAM, {
      examId,
    });
  });

  private finishExamReal = createApiMethod(async (examId: string) => {
    return await apiConfig.post(API_ENDPOINTS.USER.FINISH_EXAM, {
      examId,
    });
  });

  private answerQuestionReal = createApiMethod(
    async (id: string, data: AnswerPayload) => {
    const response = await apiConfig.post(API_ENDPOINTS.USER.ANSWER(id), {
      questionId: data.questionId,
      optionId: data.optionId,
    });
    return response;
    },
  );

  getQuestion = async (id: string) => {
    if (isDemoMode()) return demoUserService.getQuestion(id);
    return this.getQuestionReal(id);
  };

  getQuestionAnswers = async (examId: string) => {
    if (isDemoMode()) return demoUserService.getQuestionAnswers(examId);
    return this.getQuestionAnswersReal(examId);
  };

  checkStatus = async (id: string) => {
    if (isDemoMode()) return demoUserService.checkStatus(id);
    return this.checkStatusReal(id);
  };

  startExam = async (examId: string) => {
    if (isDemoMode()) return demoUserService.startExam(examId);
    return this.startExamReal(examId);
  };

  finishExam = async (examId: string) => {
    if (isDemoMode()) return demoUserService.finishExam(examId);
    return this.finishExamReal(examId);
  };

  answerQuestion = async (id: string, data: AnswerPayload) => {
    if (isDemoMode()) return demoUserService.answerQuestion(id, data);
    return this.answerQuestionReal(id, data);
  };
}

const userService = new UserService();
export default userService;
