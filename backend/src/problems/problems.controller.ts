import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProblemsService } from './problems.service';
import { CreateProblemDto, UpdateProblemDto, GetProblemsQueryDto, ProblemDetailDto } from './dto/problem.dto';
import { JwtGuard } from '@auth/guards/jwt.guard';

@ApiTags('problems')
@Controller({ path: 'problems', version: '1' })
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all problems with filters' })
  @ApiResponse({ status: 200, description: 'List of problems' })
  async getProblems(@Query() query: GetProblemsQueryDto) {
    return this.problemsService.findAll(query);
  }

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get problems statistics' })
  @ApiResponse({ status: 200, description: 'Problems stats' })
  async getStats() {
    return this.problemsService.getStats();
  }

  @Get(':idOrSlug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get problem by ID or slug' })
  @ApiResponse({ status: 200, description: 'Problem details', type: ProblemDetailDto })
  async getProblem(@Param('idOrSlug') idOrSlug: string) {
    if (idOrSlug.includes('-')) {
      return this.problemsService.findBySlug(idOrSlug);
    }
    return this.problemsService.findById(idOrSlug);
  }

  @Get(':problemId/testcases')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get test cases for a problem' })
  @ApiResponse({ status: 200, description: 'List of test cases' })
  async getTestCases(@Param('problemId') problemId: string) {
    return this.problemsService.getTestCases(problemId);
  }

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new problem (admin only)' })
  @ApiResponse({ status: 201, description: 'Problem created' })
  async createProblem(@Body() createProblemDto: CreateProblemDto) {
    return this.problemsService.create(createProblemDto);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a problem (admin only)' })
  @ApiResponse({ status: 200, description: 'Problem updated' })
  async updateProblem(
    @Param('id') id: string,
    @Body() updateProblemDto: UpdateProblemDto
  ) {
    return this.problemsService.update(id, updateProblemDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a problem (admin only)' })
  @ApiResponse({ status: 200, description: 'Problem deleted' })
  async deleteProblem(@Param('id') id: string) {
    return this.problemsService.remove(id);
  }
}
