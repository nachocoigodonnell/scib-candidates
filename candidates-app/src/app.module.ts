import { Module } from '@nestjs/common';
import { CandidateInfrastructureModule } from './infrastructure/candidate/candidate-infrastructure.module';

@Module({
  imports: [CandidateInfrastructureModule],
})
export class AppModule {}