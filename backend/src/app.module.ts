import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProblemsModule } from './problems/problems.module';
import { PrismaService } from './common/prisma/prisma.service';
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
      envFilePath: '.env'
    }),
    AuthModule,
    ProblemsModule
  ],
  providers: [PrismaService]
})
export class AppModule {}
