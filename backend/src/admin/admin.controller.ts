import { Controller, Get, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtGuard } from '@auth/guards/jwt.guard';

@ApiTags('admin')
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats/dashboard')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('stats/users')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user statistics' })
  async getUserStats(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.getUserStats(parseInt(page) || 1, parseInt(limit) || 20);
  }

  @Get('stats/problems')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get problem statistics' })
  async getProblemStats(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.getProblemStats(parseInt(page) || 1, parseInt(limit) || 20);
  }

  @Get('stats/submissions')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get submission statistics' })
  async getSubmissionStats(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.getSubmissionStats(parseInt(page) || 1, parseInt(limit) || 20);
  }

  @Get('stats/activity')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get activity feed' })
  async getActivityFeed(@Query('days') days?: string, @Query('limit') limit?: string) {
    return this.adminService.getActivityFeed(parseInt(days) || 7, parseInt(limit) || 50);
  }

  @Get('stats/languages')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get language statistics' })
  async getLanguageStats() {
    return this.adminService.getLanguageStats();
  }

  @Get('stats/difficulty')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get difficulty statistics' })
  async getDifficultyStats() {
    return this.adminService.getDifficultyStats();
  }
}
