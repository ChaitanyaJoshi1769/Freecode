import { create } from 'zustand';
import { Problem, ProblemDetail, TestCase, PaginatedResponse } from '@/types';
import api from '@/services/api';

interface ProblemStore {
  problems: Problem[];
  currentProblem: ProblemDetail | null;
  testCases: TestCase[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };

  // Actions
  fetchProblems: (page?: number, limit?: number, filters?: any) => Promise<void>;
  fetchProblemDetail: (idOrSlug: string) => Promise<void>;
  fetchTestCases: (problemId: string) => Promise<void>;
  clearCurrentProblem: () => void;
  clearError: () => void;
}

export const useProblemStore = create<ProblemStore>((set) => ({
  problems: [],
  currentProblem: null,
  testCases: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  },

  fetchProblems: async (page = 1, limit = 20, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response: PaginatedResponse<Problem> = await api.getProblems(
        page,
        limit,
        filters.difficulty,
        filters.search,
        filters.topic,
        filters.company
      );

      set({
        problems: response.data,
        pagination: response.pagination,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch problems',
        isLoading: false
      });
    }
  },

  fetchProblemDetail: async (idOrSlug) => {
    set({ isLoading: true, error: null });
    try {
      const problem = await api.getProblemDetail(idOrSlug);
      set({
        currentProblem: problem,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch problem',
        isLoading: false
      });
    }
  },

  fetchTestCases: async (problemId) => {
    try {
      const testCases = await api.getTestCases(problemId);
      set({ testCases });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch test cases'
      });
    }
  },

  clearCurrentProblem: () => set({ currentProblem: null, testCases: [] }),
  clearError: () => set({ error: null })
}));
