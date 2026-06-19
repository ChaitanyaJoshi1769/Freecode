import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateDiscussionDto, CreateCommentDto } from './dto/discussion.dto';

@Injectable()
export class DiscussionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDiscussion(userId: string, problemId: string, createDto: CreateDiscussionDto) {
    const problem = await this.prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return this.prisma.discussion.create({
      data: {
        userId,
        problemId,
        title: createDto.title,
        content: createDto.content
      }
    });
  }

  async getDiscussions(problemId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [discussions, total] = await Promise.all([
      this.prisma.discussion.findMany({
        where: { problemId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, username: true, avatar: true } } }
      }),
      this.prisma.discussion.count({ where: { problemId } })
    ]);

    return { data: discussions, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async getDiscussionById(discussionId: string) {
    const discussion = await this.prisma.discussion.findUnique({
      where: { id: discussionId },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        comments: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!discussion) {
      throw new NotFoundException('Discussion not found');
    }

    // Increment views
    await this.prisma.discussion.update({
      where: { id: discussionId },
      data: { views: { increment: 1 } }
    });

    return discussion;
  }

  async updateDiscussion(discussionId: string, userId: string, updateDto: CreateDiscussionDto) {
    const discussion = await this.prisma.discussion.findUnique({
      where: { id: discussionId }
    });

    if (!discussion) {
      throw new NotFoundException('Discussion not found');
    }

    if (discussion.userId !== userId) {
      throw new BadRequestException('You can only edit your own discussions');
    }

    return this.prisma.discussion.update({
      where: { id: discussionId },
      data: {
        title: updateDto.title,
        content: updateDto.content
      }
    });
  }

  async deleteDiscussion(discussionId: string, userId: string) {
    const discussion = await this.prisma.discussion.findUnique({
      where: { id: discussionId }
    });

    if (!discussion) {
      throw new NotFoundException('Discussion not found');
    }

    if (discussion.userId !== userId) {
      throw new BadRequestException('You can only delete your own discussions');
    }

    return this.prisma.discussion.delete({
      where: { id: discussionId }
    });
  }

  async addComment(discussionId: string, userId: string, createDto: CreateCommentDto) {
    const discussion = await this.prisma.discussion.findUnique({
      where: { id: discussionId }
    });

    if (!discussion) {
      throw new NotFoundException('Discussion not found');
    }

    return this.prisma.comment.create({
      data: {
        userId,
        discussionId,
        content: createDto.content
      }
    });
  }

  async updateComment(commentId: string, userId: string, createDto: CreateCommentDto) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new BadRequestException('You can only edit your own comments');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content: createDto.content }
    });
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new BadRequestException('You can only delete your own comments');
    }

    return this.prisma.comment.delete({
      where: { id: commentId }
    });
  }

  async likeDiscussion(discussionId: string) {
    return this.prisma.discussion.update({
      where: { id: discussionId },
      data: { likes: { increment: 1 } }
    });
  }

  async likeComment(commentId: string) {
    return this.prisma.comment.update({
      where: { id: commentId },
      data: { likes: { increment: 1 } }
    });
  }
}
