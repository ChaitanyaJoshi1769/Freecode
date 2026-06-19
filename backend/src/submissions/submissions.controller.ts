import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto, SubmissionResponseDto } from './dto/submission.dto';
import { JwtGuard } from '@auth/guards/jwt.guard';

@ApiTags('submissions')
@Controller({ path: 'submissions', version: '1' })
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit solution' })
  @ApiResponse({ status: 201, description: 'Submission created', type: SubmissionResponseDto })
  async createSubmission(
    @Request() req,
    @Body() createSubmissionDto: CreateSubmissionDto
  ) {
    return this.submissionsService.createSubmission(req.user.id, createSubmissionDto);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get submission by ID' })
  @ApiResponse({ status: 200, description: 'Submission details', type: SubmissionResponseDto })
  async getSubmission(@Request() req, @Param('id') id: string) {
    return this.submissionsService.getSubmissionById(id, req.user.id);
  }

  @Get('user/submissions')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user submissions' })
  @ApiResponse({ status: 200, description: 'User submissions' })
  async getUserSubmissions(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.submissionsService.getUserSubmissions(
      req.user.id,
      parseInt(page) || 1,
      parseInt(limit) || 20
    );
  }

  @Get('problem/:problemId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get submissions for a problem' })
  @ApiResponse({ status: 200, description: 'Problem submissions' })
  async getProblemSubmissions(
    @Param('problemId') problemId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.submissionsService.getProblemSubmissions(
      problemId,
      parseInt(page) || 1,
      parseInt(limit) || 20
    );
  }
}
