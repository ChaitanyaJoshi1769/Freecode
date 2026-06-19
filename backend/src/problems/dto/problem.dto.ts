import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { Difficulty } from '@prisma/client';

export class CreateProblemDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: Difficulty })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiProperty({ isArray: true, type: String })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  topics?: string[];

  @ApiProperty({ isArray: true, type: String })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  companies?: string[];

  @ApiProperty()
  @IsString()
  examples: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  constraints?: string;

  @ApiProperty({ isArray: true, type: String })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  hints?: string[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;
}

export class UpdateProblemDto extends CreateProblemDto {}

export class ProblemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  difficulty: Difficulty;

  @ApiProperty()
  topics: string[];

  @ApiProperty()
  companies: string[];

  @ApiProperty()
  acceptanceRate: number;

  @ApiProperty()
  totalSubmissions: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ProblemDetailDto extends ProblemResponseDto {
  @ApiProperty()
  examples: string;

  @ApiProperty()
  constraints: string;

  @ApiProperty()
  hints: string[];

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  isPremium: boolean;

  @ApiProperty()
  likes: number;

  @ApiProperty()
  dislikes: number;
}

export class GetProblemsQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  limit?: number = 20;

  @ApiProperty({ required: false, enum: Difficulty })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  sortBy?: 'asc' | 'desc' = 'desc';
}
