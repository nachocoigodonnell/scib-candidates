import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CandidateInfrastructureModule } from './infrastructure/candidate/candidate-infrastructure.module';
import { MonitoringModule } from './infrastructure/monitoring/monitoring.module';
import { HealthController } from './infrastructure/monitoring/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    CandidateInfrastructureModule.forRoot(),
    MonitoringModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}