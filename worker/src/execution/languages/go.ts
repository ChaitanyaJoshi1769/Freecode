import Docker from 'dockerode';
import { ILanguageExecutor } from '../types';
import { ExecutionRequest, ExecutionResult, TestResult } from '../executor';
import { Logger } from '../../config/logger';

const logger = new Logger('GoExecutor');
const docker = new Docker();

export class GoExecutor implements ILanguageExecutor {
  private readonly image = 'golang:1.21-alpine';

  async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    const testResults: TestResult[] = [];
    let passedTests = 0;
    let totalTests = 0;
    let status: ExecutionResult['status'] = 'ACCEPTED';
    let executionTime = 0;
    let lastError: string | undefined;

    try {
      await this.ensureImage();

      for (const testCase of request.testCases) {
        totalTests++;
        const testResult = await this.executeTestCase(
          request.code,
          testCase,
          request.timeLimit,
          request.memoryLimit
        );
        testResults.push(testResult);

        if (testResult.passed) {
          passedTests++;
        } else {
          status = 'WRONG_ANSWER';
          lastError = testResult.error;
        }

        executionTime += testResult.executionTime || 0;
      }
    } catch (error) {
      logger.error(`Go execution error: ${error}`);
      status = 'RUNTIME_ERROR';
      lastError = error instanceof Error ? error.message : 'Unknown error';
    }

    return {
      submissionId: request.submissionId,
      status,
      testResults,
      passedTests,
      totalTests,
      executionTime,
      error: lastError
    };
  }

  private async executeTestCase(
    code: string,
    testCase: { id: string; input: string; output: string },
    timeLimit: number,
    memoryLimit: number
  ): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const wrappedCode = `package main
import "fmt"
import "bufio"
import "os"

func stdin() string {
  scanner := bufio.NewScanner(os.Stdin)
  scanner.Scan()
  return scanner.Text()
}

func main() {
${code}
}`;

      const container = await docker.createContainer({
        Image: this.image,
        Cmd: ['sh', '-c', `echo '${wrappedCode.replace(/'/g, "'\\''")}' > solution.go && go run solution.go`],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        HostConfig: {
          Memory: memoryLimit * 1024 * 1024,
          CpuQuota: 100000,
          CpuPeriod: 100000
        }
      });

      const stream = await container.attach({
        stream: true,
        stdout: true,
        stderr: true,
        stdin: true
      });

      stream.write(testCase.input);
      stream.end();

      let stdout = '';

      stream.on('data', (chunk) => {
        stdout += chunk.toString();
      });

      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => {
          container.kill().catch(() => {});
          reject(new Error('Time limit exceeded'));
        }, timeLimit);

        stream.on('end', () => {
          clearTimeout(timer);
          resolve();
        });

        stream.on('error', (err) => {
          clearTimeout(timer);
          reject(err);
        });
      });

      await container.remove();

      const executionTime = Date.now() - startTime;
      const actualOutput = stdout.trim();
      const expectedOutput = testCase.output.trim();
      const passed = actualOutput === expectedOutput;

      return {
        testCaseId: testCase.id,
        passed,
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput,
        executionTime
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';

      return {
        testCaseId: testCase.id,
        passed: false,
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: '',
        error: errorMsg,
        executionTime
      };
    }
  }

  private async ensureImage(): Promise<void> {
    try {
      await docker.getImage(this.image).inspect();
    } catch {
      logger.info(`Pulling image ${this.image}...`);
      await docker.pull(this.image);
      logger.info(`Image ${this.image} pulled successfully`);
    }
  }
}
