import { Module } from '@nestjs/common';
import { DiscussionsService } from './discussions.service';
import { DiscussionsController } from './discussions.controller';
import { PrismaService } from '@common/prisma/prisma.service';

@Module({
  providers: [DiscussionsService, PrismaService],
  controllers: [DiscussionsController],
  exports: [DiscussionsService]
})
export class DiscussionsModule {}
