import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ProblemStatus } from '@prisma/client';

export class UpdateUserProgressDto {
  @ApiProperty({ enum: ProblemStatus })
  @IsEnum(ProblemStatus)
  status: ProblemStatus;
}

export class UserProgressDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  problemId: string;

  @ApiProperty()
  status: ProblemStatus;

  @ApiProperty()
  attempts: number;

  @ApiProperty({ required: false })
  lastSubmissionAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UserStatsDto {
  @ApiProperty()
  totalSolved: number;

  @ApiProperty()
  totalAttempts: number;

  @ApiProperty()
  easySolved: number;

  @ApiProperty()
  mediumSolved: number;

  @ApiProperty()
  hardSolved: number;

  @ApiProperty()
  totalSubmissions: number;

  @ApiProperty()
  acceptanceRate: number;
}
