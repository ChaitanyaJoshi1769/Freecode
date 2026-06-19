import { Language } from './types';
import { PythonExecutor } from './languages/python';
import { JavaScriptExecutor } from './languages/javascript';
import { JavaExecutor } from './languages/java';
import { CppExecutor } from './languages/cpp';
import { GoExecutor } from './languages/go';
import { RustExecutor } from './languages/rust';
import { RubyExecutor } from './languages/ruby';
import { Logger } from '../config/logger';
import * as fs from 'fs';
import * as path from 'path';

const logger = new Logger('CodeExecutor');

export interface ExecutionRequest {
  submissionId: string;
  userId: string;
  problemId: string;
  code: string;
  language: Language;
  testCases: Array<{
    id: string;
    input: string;
    output: string;
  }>;
  timeLimit: number;
  memoryLimit: number;
}

export interface ExecutionResult {
  submissionId: string;
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'MEMORY_LIMIT_EXCEEDED' | 'COMPILATION_ERROR' | 'RUNTIME_ERROR';
  testResults: TestResult[];
  passedTests: number;
  totalTests: number;
  executionTime?: number;
  memoryUsed?: number;
  error?: string;
  stdout?: string;
  stderr?: string;
}

export interface TestResult {
  testCaseId: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
  executionTime?: number;
}

export async function executeCode(request: ExecutionRequest): Promise<ExecutionResult> {
  logger.info(`Executing ${request.language} code for submission ${request.submissionId}`);

  try {
    const executor = getExecutor(request.language);
    const result = await executor.execute(request);
    logger.info(`Execution complete for submission ${request.submissionId}: ${result.status}`);
    return result;
  } catch (error) {
    logger.error(`Execution failed for submission ${request.submissionId}: ${error}`);
    return {
      submissionId: request.submissionId,
      status: 'RUNTIME_ERROR',
      testResults: [],
      passedTests: 0,
      totalTests: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

function getExecutor(language: Language) {
  switch (language) {
    case Language.PYTHON:
      return new PythonExecutor();
    case Language.JAVASCRIPT:
    case Language.TYPESCRIPT:
      return new JavaScriptExecutor();
    case Language.JAVA:
      return new JavaExecutor();
    case Language.CPP:
      return new CppExecutor();
    case Language.GOLANG:
      return new GoExecutor();
    case Language.RUST:
      return new RustExecutor();
    case Language.RUBY:
      return new RubyExecutor();
    default:
      throw new Error(`Language ${language} not yet supported`);
  }
}

export function getExecutionTimeout(timeLimit: number): number {
  return Math.min(timeLimit + 1000, 10000); // Add 1s buffer, max 10s
}
