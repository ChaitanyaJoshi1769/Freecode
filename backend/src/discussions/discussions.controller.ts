import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DiscussionsService } from './discussions.service';
import { CreateDiscussionDto, CreateCommentDto } from './dto/discussion.dto';
import { JwtGuard } from '@auth/guards/jwt.guard';

@ApiTags('discussions')
@Controller({ path: 'discussions', version: '1' })
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Get('problem/:problemId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get discussions for a problem' })
  async getDiscussions(
    @Param('problemId') problemId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.discussionsService.getDiscussions(
      problemId,
      parseInt(page) || 1,
      parseInt(limit) || 20
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get discussion with comments' })
  async getDiscussion(@Param('id') id: string) {
    return this.discussionsService.getDiscussionById(id);
  }

  @Post('problem/:problemId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new discussion' })
  async createDiscussion(
    @Request() req,
    @Param('problemId') problemId: string,
    @Body() createDto: CreateDiscussionDto
  ) {
    return this.discussionsService.createDiscussion(req.user.id, problemId, createDto);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update discussion' })
  async updateDiscussion(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: CreateDiscussionDto
  ) {
    return this.discussionsService.updateDiscussion(id, req.user.id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete discussion' })
  async deleteDiscussion(@Request() req, @Param('id') id: string) {
    return this.discussionsService.deleteDiscussion(id, req.user.id);
  }

  @Post(':discussionId/comments')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add comment to discussion' })
  async addComment(
    @Request() req,
    @Param('discussionId') discussionId: string,
    @Body() createDto: CreateCommentDto
  ) {
    return this.discussionsService.addComment(discussionId, req.user.id, createDto);
  }

  @Put('comments/:commentId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update comment' })
  async updateComment(
    @Request() req,
    @Param('commentId') commentId: string,
    @Body() updateDto: CreateCommentDto
  ) {
    return this.discussionsService.updateComment(commentId, req.user.id, updateDto);
  }

  @Delete('comments/:commentId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete comment' })
  async deleteComment(@Request() req, @Param('commentId') commentId: string) {
    return this.discussionsService.deleteComment(commentId, req.user.id);
  }

  @Post(':discussionId/like')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Like discussion' })
  async likeDiscussion(@Param('discussionId') discussionId: string) {
    return this.discussionsService.likeDiscussion(discussionId);
  }

  @Post('comments/:commentId/like')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Like comment' })
  async likeComment(@Param('commentId') commentId: string) {
    return this.discussionsService.likeComment(commentId);
  }
}
