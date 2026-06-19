import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  AuthResponse,
  Problem,
  ProblemDetail,
  Submission,
  TestCase,
  UserStats,
  UserProgress,
  PaginatedResponse,
  Bookmark,
  Language,
  ProblemStatus
} from '@/types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const response = await this.api.post('/auth/refresh-token', { refreshToken });
              localStorage.setItem('accessToken', response.data.accessToken);
              originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
              return this.api(originalRequest);
            } catch {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(email: string, username: string, password: string, firstName?: string, lastName?: string): Promise<AuthResponse> {
    const response = await this.api.post('/auth/register', {
      email,
      username,
      password,
      firstName,
      lastName
    });
    return response.data;
  }

  async login(emailOrUsername: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post('/auth/login', {
      emailOrUsername,
      password
    });
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Problems endpoints
  async getProblems(
    page = 1,
    limit = 20,
    difficulty?: string,
    search?: string,
    topic?: string,
    company?: string
  ): Promise<PaginatedResponse<Problem>> {
    const response = await this.api.get('/problems', {
      params: { page, limit, difficulty, search, topic, company }
    });
    return response.data;
  }

  async getProblemDetail(idOrSlug: string): Promise<ProblemDetail> {
    const response = await this.api.get(`/problems/${idOrSlug}`);
    return response.data;
  }

  async getTestCases(problemId: string): Promise<TestCase[]> {
    const response = await this.api.get(`/problems/${problemId}/testcases`);
    return response.data;
  }

  async getProblemsStats() {
    const response = await this.api.get('/problems/stats');
    return response.data;
  }

  // Submissions endpoints
  async submitSolution(
    problemId: string,
    code: string,
    language: Language
  ): Promise<Submission> {
    const response = await this.api.post('/submissions', {
      problemId,
      code,
      language
    });
    return response.data;
  }

  async getSubmissionById(submissionId: string): Promise<Submission> {
    const response = await this.api.get(`/submissions/${submissionId}`);
    return response.data;
  }

  async getUserSubmissions(page = 1, limit = 20): Promise<PaginatedResponse<Submission>> {
    const response = await this.api.get('/submissions/user/submissions', {
      params: { page, limit }
    });
    return response.data;
  }

  async getProblemSubmissions(
    problemId: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Submission>> {
    const response = await this.api.get(`/submissions/problem/${problemId}`, {
      params: { page, limit }
    });
    return response.data;
  }

  // User progress endpoints
  async getUserStats(): Promise<UserStats> {
    const response = await this.api.get('/users/progress');
    return response.data;
  }

  async getProblemProgress(problemId: string): Promise<UserProgress> {
    const response = await this.api.get(`/users/progress/${problemId}`);
    return response.data;
  }

  async updateProblemProgress(problemId: string, status: ProblemStatus): Promise<UserProgress> {
    const response = await this.api.put(`/users/progress/${problemId}`, { status });
    return response.data;
  }

  // Bookmarks endpoints
  async getBookmarks(page = 1, limit = 20): Promise<PaginatedResponse<Bookmark>> {
    const response = await this.api.get('/users/bookmarks', {
      params: { page, limit }
    });
    return response.data;
  }

  async addBookmark(problemId: string): Promise<Bookmark> {
    const response = await this.api.post(`/users/bookmarks/${problemId}`);
    return response.data;
  }

  async removeBookmark(problemId: string): Promise<void> {
    await this.api.delete(`/users/bookmarks/${problemId}`);
  }
}

export default new ApiService();
