import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { PostgresFileRepository } from './repositories/postgres-file.repository';
import { REPOSITORY_TOKENS } from '../../shared/constants/tokens';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [
    {
      provide: REPOSITORY_TOKENS.FILE_REPOSITORY,
      useClass: PostgresFileRepository,
    },
  ],
  exports: [REPOSITORY_TOKENS.FILE_REPOSITORY],
})
export class FileInfrastructureModule {}