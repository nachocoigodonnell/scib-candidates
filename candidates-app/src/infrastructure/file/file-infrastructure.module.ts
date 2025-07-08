import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { FileEntity } from './entities/file.entity';
import { PostgresFileRepository } from './repositories/postgres-file.repository';
import { InMemoryFileRepository } from './repositories/in-memory-file.repository';
import { REPOSITORY_TOKENS } from '../../shared/constants/tokens';

@Module({})
export class FileInfrastructureModule {
  static forRoot(): DynamicModule {
    const configService = new ConfigService();
    const databaseType = configService.get('DATABASE_TYPE');
    const isPostgres = databaseType === 'postgres';

    return {
      module: FileInfrastructureModule,
      imports: isPostgres ? [TypeOrmModule.forFeature([FileEntity])] : [],
      providers: [
        {
          provide: REPOSITORY_TOKENS.FILE_REPOSITORY,
          useFactory: (configService: ConfigService, postgresRepository?: PostgresFileRepository) => {
            const databaseType = configService.get('DATABASE_TYPE');
            
            if (databaseType === 'postgres' && postgresRepository) {
              return postgresRepository;
            }
            
            // Default to in-memory repository for local development
            return new InMemoryFileRepository();
          },
          inject: [
            ConfigService,
            ...(isPostgres ? [{ token: PostgresFileRepository, optional: true }] : [])
          ],
        },
        ...(isPostgres ? [PostgresFileRepository] : []),
      ],
      exports: [REPOSITORY_TOKENS.FILE_REPOSITORY],
    };
  }
}