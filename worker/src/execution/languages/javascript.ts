import { ILanguageExecutor } from '../types';
import { ExecutionRequest, ExecutionResult } from '../executor';

export class JavaScriptExecutor implements ILanguageExecutor {
  async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    // Phase 2: Implement JavaScript code execution using Docker
    return {
      submissionId: request.submissionId,
      status: 'ACCEPTED',
      testResults: [],
      passedTests: 0,
      totalTests: 0,
      error: 'JavaScript executor coming in Phase 2'
    };
  }
}
