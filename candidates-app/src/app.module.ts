import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CandidateInfrastructureModule } from './infrastructure/candidate/candidate-infrastructure.module';
import { HealthController } from './infrastructure/health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    CandidateInfrastructureModule.forRoot(),
  ],
  controllers: [HealthController],
})
export class AppModule {}