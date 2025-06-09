import { Module } from '@nestjs/common';
import { REPOSITORY_TOKENS, SERVICE_TOKENS } from '../../shared/constants/tokens';
import { InMemoryCandidateRepository } from './repositories/in-memory-candidate.repository';
import { XlsxExcelParserService } from './services/xlsx-excel-parser.service';
import { CandidateController } from './controllers/candidate.controller';
import { CreateCandidateUseCase } from '../../application/candidate/use-cases/create-candidate.use-case';
import { GetAllCandidatesUseCase } from '../../application/candidate/use-cases/get-all-candidates.use-case';

@Module({
  controllers: [CandidateController],
  providers: [
    {
      provide: REPOSITORY_TOKENS.CANDIDATE_REPOSITORY,
      useClass: InMemoryCandidateRepository,
    },
    {
      provide: SERVICE_TOKENS.EXCEL_PARSER_SERVICE,
      useClass: XlsxExcelParserService,
    },
    CreateCandidateUseCase,
    GetAllCandidatesUseCase,
  ],
  exports: [REPOSITORY_TOKENS.CANDIDATE_REPOSITORY, SERVICE_TOKENS.EXCEL_PARSER_SERVICE],
})
export class CandidateInfrastructureModule {}