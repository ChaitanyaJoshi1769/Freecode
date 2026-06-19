import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { PrismaService } from '@common/prisma/prisma.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'code-execution' })],
  providers: [SubmissionsService, PrismaService],
  controllers: [SubmissionsController],
  exports: [SubmissionsService]
})
export class SubmissionsModule {}
