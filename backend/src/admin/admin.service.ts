import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // Analytics
  async getDashboardStats() {
    const [
      totalUsers,
      totalProblems,
      totalSubmissions,
      acceptedSubmissions,
      easyProblems,
      mediumProblems,
      hardProblems,
      activeUsers
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.problem.count(),
      this.prisma.submission.count(),
      this.prisma.submission.count({ where: { status: 'ACCEPTED' } }),
      this.prisma.problem.count({ where: { difficulty: 'EASY' } }),
      this.prisma.problem.count({ where: { difficulty: 'MEDIUM' } }),
      this.prisma.problem.count({ where: { difficulty: 'HARD' } }),
      this.prisma.user.count({
        where: { submissions: { some: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } } }
      })
    ]);

    return {
      totalUsers,
      totalProblems,
      totalSubmissions,
      acceptanceRate: ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2),
      problemsDistribution: { easy: easyProblems, medium: mediumProblems, hard: hardProblems },
      activeUsersLastWeek: activeUsers
    };
  }

  async getUserStats(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
          submissions: { select: { id: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.user.count()
    ]);

    const usersWithStats = users.map(user => ({
      ...user,
      submissionCount: user.submissions.length
    }));

    return { data: usersWithStats, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async getProblemStats(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [problems, total] = await Promise.all([
      this.prisma.problem.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          difficulty: true,
          acceptanceRate: true,
          totalSubmissions: true,
          likes: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.problem.count()
    ]);

    return { data: problems, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async getSubmissionStats(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [submissions, statusDistribution, total] = await Promise.all([
      this.prisma.submission.findMany({
        skip,
        take: limit,
        include: { user: { select: { username: true } }, problem: { select: { title: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.submission.groupBy({
        by: ['status'],
        _count: true
      }),
      this.prisma.submission.count()
    ]);

    return {
      data: submissions,
      statusDistribution,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async getActivityFeed(days = 7, limit = 50) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [submissions, discussions, newUsers] = await Promise.all([
      this.prisma.submission.findMany({
        where: { createdAt: { gte: startDate } },
        take: limit,
        select: { id: true, userId: true, createdAt: true, status: true },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.discussion.findMany({
        where: { createdAt: { gte: startDate } },
        take: limit,
        select: { id: true, userId: true, createdAt: true, title: true },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.user.findMany({
        where: { createdAt: { gte: startDate } },
        take: limit,
        select: { id: true, username: true, createdAt: true },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return { submissions, discussions, newUsers };
  }

  async getLanguageStats() {
    const stats = await this.prisma.submission.groupBy({
      by: ['language'],
      _count: true,
      orderBy: { _count: { language: 'desc' } }
    });

    return stats;
  }

  async getDifficultyStats() {
    const stats = await this.prisma.submission.groupBy({
      by: ['problemId'],
      _count: true
    });

    // Get difficulty info for each problem
    const problemIds = stats.map(s => s.problemId);
    const problems = await this.prisma.problem.findMany({
      where: { id: { in: problemIds } },
      select: { id: true, difficulty: true }
    });

    const difficultyMap = new Map(problems.map(p => [p.id, p.difficulty]));
    const result = { EASY: 0, MEDIUM: 0, HARD: 0 };

    stats.forEach(stat => {
      const difficulty = difficultyMap.get(stat.problemId);
      if (difficulty) {
        result[difficulty as keyof typeof result]++;
      }
    });

    return result;
  }
}
