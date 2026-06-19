import { useQuery } from '@tanstack/react-query';
import { Problem, ProblemDetail, TestCase, PaginatedResponse } from '@/types';
import api from '@/services/api';

export const useProblems = (page = 1, limit = 20, filters?: any) => {
  return useQuery({
    queryKey: ['problems', page, limit, filters],
    queryFn: () =>
      api.getProblems(page, limit, filters?.difficulty, filters?.search, filters?.topic, filters?.company),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProblemDetail = (idOrSlug?: string) => {
  return useQuery({
    queryKey: ['problem', idOrSlug],
    queryFn: () => api.getProblemDetail(idOrSlug!),
    enabled: !!idOrSlug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTestCases = (problemId?: string) => {
  return useQuery({
    queryKey: ['testcases', problemId],
    queryFn: () => api.getTestCases(problemId!),
    enabled: !!problemId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useProblemsStats = () => {
  return useQuery({
    queryKey: ['problems-stats'],
    queryFn: () => api.getProblemsStats(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
