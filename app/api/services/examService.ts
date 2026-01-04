import { TestData } from "@/types/testTypes";
import apiConfig from "../config/api";
import { API_ENDPOINTS } from "../config/endpoint";
import { createApiMethod } from "../utils/apiUtils";

interface OptionsPayload {
  text: string;
  isCorrect: boolean;
}

class ExamService {
  //===EXAM
  createExam = createApiMethod(async (data: TestData) => {
    const response = await apiConfig.post(API_ENDPOINTS.ADMIN.GENERATE_EXAMS, {
      title: data.title,
      description: data.description,
      startAt: new Date(data.startAt).toISOString(),
      endAt: new Date(data.endAt).toISOString(),
      durationMinutes: data.durationMinutes,
    });

    return response;
  });

  getExamDetail = createApiMethod(async (id: string) => {
    const response = await apiConfig.get(API_ENDPOINTS.ADMIN.GET_EXAM(id));
    return response;
  });

  getAllExams = createApiMethod(async () => {
    const response = await apiConfig.get(API_ENDPOINTS.ADMIN.GET_ALL_EXAMS);
    return response;
  });

  //===QUESTION
  createQuestion = createApiMethod(async (examId: string, text: string) => {
    const response = await apiConfig.post(
      API_ENDPOINTS.ADMIN.GENERATE_QUESTIONS(examId),
      { text }
    );
    return response;
  });

  getQuestion = createApiMethod(async (id: string) => {
    const response = await apiConfig.get(API_ENDPOINTS.ADMIN.GET_QUESTION(id));
    return response;
  });

  //===OPTIONS
  createOptions = createApiMethod(
    async (questionId: string, data: OptionsPayload) => {
      const response = await apiConfig.post(
        API_ENDPOINTS.ADMIN.GENERATE_OPTIONS(questionId),
        {
          text: data.text,
          isCorrect: data.isCorrect,
        }
      );

      return response;
    }
  );
}

const examService = new ExamService();
export default examService;
