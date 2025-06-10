import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CandidateEntity } from '../candidate/entities/candidate.entity';
import { FileEntity } from '../file/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseType = configService.get('DATABASE_TYPE');
        
        if (databaseType === 'postgres') {
          return {
            type: 'postgres',
            host: configService.get('DATABASE_HOST', 'localhost'),
            port: parseInt(configService.get('DATABASE_PORT', '5432')),
            username: configService.get('DATABASE_USER', 'candidates_user'),
            password: configService.get('DATABASE_PASSWORD', 'candidates_password'),
            database: configService.get('DATABASE_NAME', 'candidates'),
            entities: [CandidateEntity, FileEntity],
            synchronize: true, // Only for development - use migrations in production
            logging: configService.get('NODE_ENV') !== 'production',
          };
        }
        
        // Return empty config for non-postgres environments
        return null;
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([CandidateEntity, FileEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}