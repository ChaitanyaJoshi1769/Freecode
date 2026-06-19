import { Language } from './types';
import { PythonExecutor } from './languages/python';
import { JavaScriptExecutor } from './languages/javascript';
import { Logger } from '../config/logger';

const logger = new Logger('CodeExecutor');

export interface ExecutionRequest {
  submissionId: string;
  userId: string;
  problemId: string;
  code: string;
  language: Language;
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
    logger.info(`Execution complete for submission ${request.submissionId}`);
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
    // More executors coming in Phase 2
    default:
      throw new Error(`Language ${language} not yet supported`);
  }
}
