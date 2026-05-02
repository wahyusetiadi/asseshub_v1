import { TestBase } from "@/types/testTypes";
import apiConfig from "../config/api";
import { API_ENDPOINTS } from "../config/endpoint";
import { createApiMethod } from "../utils/apiUtils";
import { isDemoMode } from "@/helpers/demo";
import { demoExamService } from "../mock/demoServices";

interface OptionsPayload {
  text: string;
  isCorrect: boolean;
}

class ExamService {
  //===EXAM
  private createExamReal = createApiMethod(async (data: TestBase) => {
    const response = await apiConfig.post(API_ENDPOINTS.ADMIN.GENERATE_EXAMS, {
      title: data.title,
      description: data.description,
      startAt: data.startAt,
      endAt: data.endAt,
      durationMinutes: data.durationMinutes,
      categoryId: data.categoryId,
    });

    return response;
  });

  private updateExamReal = createApiMethod(async (id: string, data: TestBase) => {
    const response = await apiConfig.patch(
      API_ENDPOINTS.ADMIN.UPDATE_EXAM(id),
      {
        title: data.title,
        description: data.description,
        // startAt: new Date(data.startAt).toISOString(),
        // endAt: new Date(data.endAt).toISOString(),
        startAt: data.startAt,
        endAt: data.endAt,
        durationMinutes: data.durationMinutes,
        categoryId: data.categoryId,
      },
    );
    return response;
  });

  private getExamDetailReal = createApiMethod(async (id: string) => {
    const response = await apiConfig.get(API_ENDPOINTS.ADMIN.GET_EXAM(id));
    return response;
  });

  private getAllExamsReal = createApiMethod(async () => {
    const response = await apiConfig.get(API_ENDPOINTS.ADMIN.GET_ALL_EXAMS);
    return response;
  });

  //===QUESTION
  private createQuestionReal = createApiMethod(async (examId: string, text: string) => {
    const response = await apiConfig.post(
      API_ENDPOINTS.ADMIN.GENERATE_QUESTIONS(examId),
      { text },
    );
    return response;
  });

  private getQuestionReal = createApiMethod(async (id: string) => {
    const response = await apiConfig.get(API_ENDPOINTS.ADMIN.GET_QUESTION(id));
    return response;
  });

  private updateQuestionReal = createApiMethod(async (id: string, text: string) => {
    const response = await apiConfig.patch(
      API_ENDPOINTS.ADMIN.UPDATE_QUESTION(id),
      { text },
    );
    return response;
  });

  private deleteExamReal = createApiMethod(async (id: string) => {
    const response = await apiConfig.delete(
      API_ENDPOINTS.ADMIN.DELETE_EXAMS(id),
    );
    return response;
  });

  private deleteQuestionReal = createApiMethod(async (id: string) => {
    const response = await apiConfig.delete(
      API_ENDPOINTS.ADMIN.DELETE_QUESTION(id),
    );
    return response;
  });

  //===OPTIONS
  private createOptionsReal = createApiMethod(
    async (questionId: string, data: OptionsPayload) => {
      const response = await apiConfig.post(
        API_ENDPOINTS.ADMIN.GENERATE_OPTIONS(questionId),
        {
          text: data.text,
          isCorrect: data.isCorrect,
        },
      );

      return response;
    },
  );

  private getOptionsReal = createApiMethod(async (id: string) => {
    const response = await apiConfig.get(API_ENDPOINTS.ADMIN.GET_QUESTION(id));
    return response;
  });

  private updateOptionReal = createApiMethod(
    async (id: string, data: { text: string; isCorrect?: boolean }) => {
      const response = await apiConfig.put(
        API_ENDPOINTS.ADMIN.UPDATE_OPTION(id),
        data,
      );
      return response;
    },
  );

  //===RESULT (ADMIN_ONLY)
  private resultsExamReal = createApiMethod(async () => {
    const response = await apiConfig.get(API_ENDPOINTS.ADMIN.GET_ALL_RESULTS);
    return response;
  });

  createExam = async (data: TestBase) => {
    if (isDemoMode()) return demoExamService.createExam(data);
    return this.createExamReal(data);
  };

  updateExam = async (id: string, data: TestBase) => {
    if (isDemoMode()) return demoExamService.updateExam(id, data);
    return this.updateExamReal(id, data);
  };

  getExamDetail = async (id: string) => {
    if (isDemoMode()) return demoExamService.getExamDetail(id);
    return this.getExamDetailReal(id);
  };

  getAllExams = async () => {
    if (isDemoMode()) return demoExamService.getAllExams();
    return this.getAllExamsReal();
  };

  createQuestion = async (examId: string, text: string) => {
    if (isDemoMode()) return demoExamService.createQuestion(examId, text);
    return this.createQuestionReal(examId, text);
  };

  getQuestion = async (id: string) => {
    if (isDemoMode()) return demoExamService.getQuestion(id);
    return this.getQuestionReal(id);
  };

  updateQuestion = async (id: string, text: string) => {
    if (isDemoMode()) return demoExamService.updateQuestion(id, text);
    return this.updateQuestionReal(id, text);
  };

  deleteExam = async (id: string) => {
    if (isDemoMode()) return demoExamService.deleteExam(id);
    return this.deleteExamReal(id);
  };

  deleteQuestion = async (id: string) => {
    if (isDemoMode()) return demoExamService.deleteQuestion(id);
    return this.deleteQuestionReal(id);
  };

  createOptions = async (questionId: string, data: OptionsPayload) => {
    if (isDemoMode()) return demoExamService.createOptions(questionId, data);
    return this.createOptionsReal(questionId, data);
  };

  getOptions = async (id: string) => {
    if (isDemoMode()) return demoExamService.getQuestion(id);
    return this.getOptionsReal(id);
  };

  updateOption = async (
    id: string,
    data: { text: string; isCorrect?: boolean },
  ) => {
    if (isDemoMode()) return demoExamService.updateOption(id, data);
    return this.updateOptionReal(id, data);
  };

  resultsExam = async () => {
    if (isDemoMode()) return demoExamService.resultsExam();
    return this.resultsExamReal();
  };
}

const examService = new ExamService();
export default examService;
