import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { Language, SubmissionStatus } from '@prisma/client';

export class CreateSubmissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  problemId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ enum: Language })
  @IsEnum(Language)
  language: Language;
}

export class SubmissionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  problemId: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  language: Language;

  @ApiProperty()
  status: SubmissionStatus;

  @ApiProperty({ required: false })
  error?: string;

  @ApiProperty({ required: false })
  stdout?: string;

  @ApiProperty({ required: false })
  stderr?: string;

  @ApiProperty({ required: false })
  executionTime?: number;

  @ApiProperty({ required: false })
  memoryUsed?: number;

  @ApiProperty()
  testResults: string;

  @ApiProperty()
  passedTests: number;

  @ApiProperty()
  totalTests: number;

  @ApiProperty()
  createdAt: Date;
}
