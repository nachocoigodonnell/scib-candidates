import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REPOSITORY_TOKENS, SERVICE_TOKENS } from '../../shared/constants/tokens';
import { InMemoryCandidateRepository } from './repositories/in-memory-candidate.repository';
import { PostgresCandidateRepository } from './repositories/postgres-candidate.repository';
import { XlsxExcelParserService } from './services/xlsx-excel-parser.service';
import { CandidateController } from './controllers/candidate.controller';
import { CreateCandidateUseCase } from '../../application/candidate/use-cases/create-candidate.use-case';
import { GetAllCandidatesUseCase } from '../../application/candidate/use-cases/get-all-candidates.use-case';
import { DatabaseModule } from '../database/database.module';

@Module({})
export class CandidateInfrastructureModule {
  static forRoot(): DynamicModule {
    const configService = new ConfigService();
    const databaseType = configService.get('DATABASE_TYPE');
    const isPostgres = databaseType === 'postgres';

    return {
      module: CandidateInfrastructureModule,
      imports: isPostgres ? [DatabaseModule] : [],
      controllers: [CandidateController],
      providers: [
        {
          provide: REPOSITORY_TOKENS.CANDIDATE_REPOSITORY,
          useFactory: (configService: ConfigService, postgresRepository?: PostgresCandidateRepository) => {
            const databaseType = configService.get('DATABASE_TYPE');
            
            if (databaseType === 'postgres' && postgresRepository) {
              return postgresRepository;
            }
            
            // Default to in-memory repository for local development
            return new InMemoryCandidateRepository();
          },
          inject: [
            ConfigService, 
            ...(isPostgres ? [{ token: PostgresCandidateRepository, optional: true }] : [])
          ],
        },
        {
          provide: SERVICE_TOKENS.EXCEL_PARSER_SERVICE,
          useClass: XlsxExcelParserService,
        },
        ...(isPostgres ? [PostgresCandidateRepository] : []),
        CreateCandidateUseCase,
        GetAllCandidatesUseCase,
        InMemoryCandidateRepository,
      ],
      exports: [REPOSITORY_TOKENS.CANDIDATE_REPOSITORY, SERVICE_TOKENS.EXCEL_PARSER_SERVICE],
    };
  }
}