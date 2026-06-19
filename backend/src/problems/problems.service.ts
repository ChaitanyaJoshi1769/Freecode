import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateProblemDto, UpdateProblemDto, GetProblemsQueryDto } from './dto/problem.dto';
import * as slugify from 'slugify';

@Injectable()
export class ProblemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProblemDto: CreateProblemDto) {
    const { title, ...rest } = createProblemDto;
    const slug = slugify(title, { lower: true, strict: true });

    return this.prisma.problem.create({
      data: {
        ...rest,
        title,
        slug,
        examples: createProblemDto.examples,
        constraints: createProblemDto.constraints || ''
      }
    });
  }

  async findAll(query: GetProblemsQueryDto) {
    const {
      page = 1,
      limit = 20,
      difficulty,
      search,
      topic,
      company
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {
      isPublished: true
    };

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (topic) {
      where.topics = { has: topic };
    }

    if (company) {
      where.companies = { has: company };
    }

    const [problems, total] = await Promise.all([
      this.prisma.problem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.problem.count({ where })
    ]);

    return {
      data: problems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findBySlug(slug: string) {
    const problem = await this.prisma.problem.findUnique({
      where: { slug },
      include: {
        testCases: {
          where: { isPublic: true }
        }
      }
    });

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return problem;
  }

  async findById(id: string) {
    const problem = await this.prisma.problem.findUnique({
      where: { id },
      include: {
        testCases: {
          where: { isPublic: true }
        }
      }
    });

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return problem;
  }

  async getTestCases(problemId: string) {
    const problem = await this.prisma.problem.findUnique({
      where: { id: problemId }
    });

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return this.prisma.testCase.findMany({
      where: { problemId },
      select: {
        id: true,
        input: true,
        output: true,
        isPublic: true,
        explanation: true
      }
    });
  }

  async update(id: string, updateProblemDto: UpdateProblemDto) {
    const problem = await this.prisma.problem.findUnique({
      where: { id }
    });

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return this.prisma.problem.update({
      where: { id },
      data: updateProblemDto
    });
  }

  async remove(id: string) {
    const problem = await this.prisma.problem.findUnique({
      where: { id }
    });

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return this.prisma.problem.delete({
      where: { id }
    });
  }

  async getStats() {
    const [
      totalProblems,
      easyCount,
      mediumCount,
      hardCount,
      totalSubmissions
    ] = await Promise.all([
      this.prisma.problem.count(),
      this.prisma.problem.count({ where: { difficulty: 'EASY' } }),
      this.prisma.problem.count({ where: { difficulty: 'MEDIUM' } }),
      this.prisma.problem.count({ where: { difficulty: 'HARD' } }),
      this.prisma.submission.count()
    ]);

    return {
      totalProblems,
      byDifficulty: {
        easy: easyCount,
        medium: mediumCount,
        hard: hardCount
      },
      totalSubmissions
    };
  }
}
