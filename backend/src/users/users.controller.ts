import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserProgressDto, UserStatsDto, UserProgressDto } from './dto/user-progress.dto';
import { JwtGuard } from '@auth/guards/jwt.guard';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('progress')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user statistics and progress' })
  @ApiResponse({ status: 200, description: 'User stats', type: UserStatsDto })
  async getUserStats(@Request() req): Promise<UserStatsDto> {
    return this.usersService.getUserStats(req.user.id);
  }

  @Get('progress/:problemId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get progress for specific problem' })
  @ApiResponse({ status: 200, description: 'Problem progress', type: UserProgressDto })
  async getProblemProgress(@Request() req, @Param('problemId') problemId: string) {
    return this.usersService.getUserProgress(req.user.id, problemId);
  }

  @Put('progress/:problemId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update problem progress status' })
  @ApiResponse({ status: 200, description: 'Progress updated', type: UserProgressDto })
  async updateProblemProgress(
    @Request() req,
    @Param('problemId') problemId: string,
    @Body() updateProgressDto: UpdateUserProgressDto
  ) {
    return this.usersService.updateUserProgress(req.user.id, problemId, updateProgressDto);
  }

  @Get('bookmarks')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get bookmarked problems' })
  @ApiResponse({ status: 200, description: 'Bookmarked problems' })
  async getBookmarks(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.usersService.getBookmarks(
      req.user.id,
      parseInt(page) || 1,
      parseInt(limit) || 20
    );
  }

  @Post('bookmarks/:problemId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Bookmark a problem' })
  @ApiResponse({ status: 201, description: 'Problem bookmarked' })
  async addBookmark(@Request() req, @Param('problemId') problemId: string) {
    return this.usersService.addBookmark(req.user.id, problemId);
  }

  @Delete('bookmarks/:problemId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove bookmark' })
  @ApiResponse({ status: 200, description: 'Bookmark removed' })
  async removeBookmark(@Request() req, @Param('problemId') problemId: string) {
    return this.usersService.removeBookmark(req.user.id, problemId);
  }
}
