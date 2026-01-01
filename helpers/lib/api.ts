import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  Candidate,
  CreateCandidateRequest,
  UpdateCandidateRequest,
  GetCandidatesParams,
  Test,
  CreateTestRequest,
  SendInvitationRequest,
  Invitation,
  TestResult,
  GetResultsParams,
} from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const fullUrl = `${API_URL}${endpoint}`;

    console.log('🌐 API Request:', fullUrl);
    console.log('🌐 Method:', options.method || 'GET');

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(fullUrl, config);
      console.log('📥 Response Status:', response.status);

      const data = await response.json();
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  // Auth
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password } as LoginRequest),
    });
  }

  // Candidates
  async getCandidates(params?: GetCandidatesParams): Promise<ApiResponse<Candidate[]>> {
    console.log('🔍 getCandidates called with params:', params);

    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    const endpoint = `/candidates${query ? `?${query}` : ''}`;

    console.log('🔍 Final endpoint:', endpoint);

    return this.request<Candidate[]>(endpoint);
  }

  async getCandidate(id: number): Promise<ApiResponse<Candidate>> {
    return this.request<Candidate>(`/candidates/${id}`);
  }

  async createCandidate(data: CreateCandidateRequest): Promise<ApiResponse<Candidate>> {
    console.log('📝 Creating candidate:', data);
    return this.request<Candidate>('/candidates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCandidate(id: number, data: UpdateCandidateRequest): Promise<ApiResponse<Candidate>> {
    return this.request<Candidate>(`/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCandidate(id: number): Promise<ApiResponse<void>> {
    console.log('🗑️ Deleting candidate:', id);
    return this.request<void>(`/candidates/${id}`, {
      method: 'DELETE',
    });
  }

  async importCandidates(file: File): Promise<ApiResponse<Candidate[]>> {
    const formData = new FormData();
    formData.append('file', file);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const fullUrl = `${API_URL}/candidates/import`;

    console.log('📤 Importing candidates from file:', file.name);

    const response = await fetch(fullUrl, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Import failed');
    }

    return data;
  }

  // Tests
  async getTests(): Promise<ApiResponse<Test[]>> {
    return this.request<Test[]>('/tests');
  }

  async getTest(id: number): Promise<ApiResponse<Test>> {
    return this.request<Test>(`/tests/${id}`);
  }

  async createTest(data: CreateTestRequest): Promise<ApiResponse<Test>> {
    return this.request<Test>('/tests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTest(id: number, data: Partial<CreateTestRequest>): Promise<ApiResponse<Test>> {
    return this.request<Test>(`/tests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTest(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/tests/${id}`, {
      method: 'DELETE',
    });
  }

  // Invitations
  async sendInvitations(data: SendInvitationRequest): Promise<ApiResponse<Invitation[]>> {
    return this.request<Invitation[]>('/invitations/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Results
  async getResults(params?: GetResultsParams): Promise<ApiResponse<TestResult[]>> {
    const searchParams = new URLSearchParams();
    if (params?.testId) searchParams.append('testId', params.testId.toString());
    if (params?.candidateId) searchParams.append('candidateId', params.candidateId.toString());

    const query = searchParams.toString();
    return this.request<TestResult[]>(`/results${query ? `?${query}` : ''}`);
  }
}

export const api = new ApiService();
