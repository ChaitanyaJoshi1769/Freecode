import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateSubmissionDto } from './dto/submission.dto';
import { SubmissionStatus } from '@prisma/client';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('code-execution') private codeQueue: Queue
  ) {}

  async createSubmission(userId: string, createSubmissionDto: CreateSubmissionDto) {
    const { problemId, code, language } = createSubmissionDto;

    // Verify problem exists
    const problem = await this.prisma.problem.findUnique({
      where: { id: problemId }
    });

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    // Create submission
    const submission = await this.prisma.submission.create({
      data: {
        userId,
        problemId,
        code,
        language,
        status: SubmissionStatus.PENDING,
        testResults: JSON.stringify([])
      }
    });

    // Queue code execution job
    await this.codeQueue.add(
      'execute-code',
      {
        submissionId: submission.id,
        userId,
        problemId,
        code,
        language
      },
      { attempts: 3, backoff: { type: 'exponential', delay: 2000 } }
    );

    return submission;
  }

  async getSubmissionById(submissionId: string, userId?: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId }
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Check ownership if userId provided
    if (userId && submission.userId !== userId) {
      throw new BadRequestException('Cannot access this submission');
    }

    return submission;
  }

  async getUserSubmissions(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      this.prisma.submission.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          problem: {
            select: { id: true, title: true, slug: true, difficulty: true }
          }
        }
      }),
      this.prisma.submission.count({ where: { userId } })
    ]);

    return {
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getProblemSubmissions(problemId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      this.prisma.submission.findMany({
        where: { problemId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.submission.count({ where: { problemId } })
    ]);

    return {
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateSubmissionResult(
    submissionId: string,
    result: {
      status: SubmissionStatus;
      testResults: any[];
      passedTests: number;
      totalTests: number;
      executionTime?: number;
      memoryUsed?: number;
      error?: string;
      stdout?: string;
      stderr?: string;
    }
  ) {
    const submission = await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: result.status,
        testResults: JSON.stringify(result.testResults),
        passedTests: result.passedTests,
        totalTests: result.totalTests,
        executionTime: result.executionTime,
        memoryUsed: result.memoryUsed,
        error: result.error,
        stdout: result.stdout,
        stderr: result.stderr
      }
    });

    // Update user progress if submission is accepted
    if (result.status === SubmissionStatus.ACCEPTED) {
      await this.prisma.userProgress.update({
        where: {
          userId_problemId: {
            userId: submission.userId,
            problemId: submission.problemId
          }
        },
        data: {
          status: 'SOLVED',
          lastSubmissionAt: new Date()
        }
      });
    }

    return submission;
  }
}
