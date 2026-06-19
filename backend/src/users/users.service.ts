import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { UpdateUserProgressDto, UserStatsDto } from './dto/user-progress.dto';
import { ProblemStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserStats(userId: string): Promise<UserStatsDto> {
    // Get all user solved problems
    const solvedProblems = await this.prisma.userProgress.findMany({
      where: {
        userId,
        status: ProblemStatus.SOLVED
      },
      include: {
        problem: {
          select: { difficulty: true }
        }
      }
    });

    const totalSolved = solvedProblems.length;
    const easySolved = solvedProblems.filter(p => p.problem.difficulty === 'EASY').length;
    const mediumSolved = solvedProblems.filter(p => p.problem.difficulty === 'MEDIUM').length;
    const hardSolved = solvedProblems.filter(p => p.problem.difficulty === 'HARD').length;

    // Get all submissions
    const submissions = await this.prisma.submission.findMany({
      where: { userId },
      select: { status: true }
    });

    const totalSubmissions = submissions.length;
    const acceptedCount = submissions.filter(s => s.status === 'ACCEPTED').length;
    const acceptanceRate = totalSubmissions > 0 ? (acceptedCount / totalSubmissions) * 100 : 0;

    // Get attempts
    const allProgress = await this.prisma.userProgress.findMany({
      where: { userId }
    });

    const totalAttempts = allProgress.reduce((sum, p) => sum + p.attempts, 0);

    return {
      totalSolved,
      totalAttempts,
      easySolved,
      mediumSolved,
      hardSolved,
      totalSubmissions,
      acceptanceRate: Math.round(acceptanceRate * 100) / 100
    };
  }

  async getUserProgress(userId: string, problemId: string) {
    let progress = await this.prisma.userProgress.findUnique({
      where: {
        userId_problemId: { userId, problemId }
      }
    });

    if (!progress) {
      // Create if doesn't exist
      progress = await this.prisma.userProgress.create({
        data: {
          userId,
          problemId,
          status: ProblemStatus.TODO,
          attempts: 0
        }
      });
    }

    return progress;
  }

  async updateUserProgress(
    userId: string,
    problemId: string,
    updateProgressDto: UpdateUserProgressDto
  ) {
    const progress = await this.getUserProgress(userId, problemId);

    return this.prisma.userProgress.update({
      where: {
        userId_problemId: { userId, problemId }
      },
      data: {
        status: updateProgressDto.status,
        attempts: {
          increment: 1
        }
      }
    });
  }

  async getBookmarks(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      this.prisma.bookmark.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              slug: true,
              difficulty: true,
              acceptanceRate: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.bookmark.count({ where: { userId } })
    ]);

    return {
      data: bookmarks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async addBookmark(userId: string, problemId: string) {
    // Check if problem exists
    const problem = await this.prisma.problem.findUnique({
      where: { id: problemId }
    });

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    // Check if already bookmarked
    const existing = await this.prisma.bookmark.findUnique({
      where: {
        userId_problemId: { userId, problemId }
      }
    });

    if (existing) {
      return existing;
    }

    return this.prisma.bookmark.create({
      data: {
        userId,
        problemId
      }
    });
  }

  async removeBookmark(userId: string, problemId: string) {
    return this.prisma.bookmark.delete({
      where: {
        userId_problemId: { userId, problemId }
      }
    });
  }

  async isBookmarked(userId: string, problemId: string) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_problemId: { userId, problemId }
      }
    });

    return !!bookmark;
  }
}
