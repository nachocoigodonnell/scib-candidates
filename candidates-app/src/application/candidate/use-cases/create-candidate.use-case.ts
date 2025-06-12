import { Injectable, Inject } from '@nestjs/common';
import { CandidateRepository } from '../../../domain/candidate/repositories/candidate.repository';
import { CandidateEntity } from '../../../domain/candidate/entities/candidate.entity';
import { CandidateNameVO } from '../../../domain/candidate/value-objects/candidate-name.vo';
import { SeniorityVO } from '../../../domain/candidate/value-objects/seniority.vo';
import { YearsExperienceVO } from '../../../domain/candidate/value-objects/years-experience.vo';
import { AvailabilityVO } from '../../../domain/candidate/value-objects/availability.vo';
import { FileEntity } from '../../../domain/file/entities/file.entity';
import { FileRepository } from '../../../domain/file/repositories/file.repository';
import { FileNameVO } from '../../../domain/file/value-objects/file-name.vo';
import { FileUrlVO } from '../../../domain/file/value-objects/file-url.vo';
import { FileMimeTypeVO } from '../../../domain/file/value-objects/file-mime-type.vo';
import { FileSizeVO } from '../../../domain/file/value-objects/file-size.vo';
import { CreateCandidateDto } from '../dtos/create-candidate.dto';
import { CandidateResponseDto } from '../dtos/candidate-response.dto';
import { ExcelParserService } from '../services/excel-parser.service';
import { FileStorageService } from '../services/file-storage.service';
import { REPOSITORY_TOKENS, SERVICE_TOKENS } from '../../../shared/constants/tokens';
import { CustomLogger } from '../../../infrastructure/monitoring/custom.logger';
import { BusinessMetricsService } from '../../../infrastructure/monitoring/business-metrics.service';

@Injectable()
export class CreateCandidateUseCase {
  private readonly logger = new CustomLogger(CreateCandidateUseCase.name);

  constructor(
    @Inject(REPOSITORY_TOKENS.CANDIDATE_REPOSITORY)
    private readonly candidateRepository: CandidateRepository,
    @Inject(REPOSITORY_TOKENS.FILE_REPOSITORY)
    private readonly fileRepository: FileRepository,
    @Inject(SERVICE_TOKENS.EXCEL_PARSER_SERVICE)
    private readonly excelParserService: ExcelParserService,
    @Inject(SERVICE_TOKENS.FILE_STORAGE_SERVICE)
    private readonly fileStorageService: FileStorageService,
    private readonly businessMetricsService: BusinessMetricsService
  ) {}

  async execute(
    createCandidateDto: CreateCandidateDto,
    excelFileBuffer: Buffer,
    originalFileName: string
  ): Promise<CandidateResponseDto> {
    const startTime = new Date();
    
    this.logger.log(`[CANDIDATE_CREATION_START] Starting candidate creation process - ${createCandidateDto.firstName} ${createCandidateDto.lastName} - File: ${originalFileName}`);

    try {
      // Parse Excel file
      this.logger.log(`[EXCEL_PARSING] Parsing Excel file: ${originalFileName}`);
      const excelData = this.excelParserService.parseExcelFile(excelFileBuffer);
      
      this.logger.log(`[EXCEL_PARSED] Excel data extracted successfully - Seniority: ${excelData.seniority}, Experience: ${excelData.yearsOfExperience}, Available: ${excelData.availability}`);
      
      // Upload the Excel file
      this.logger.log(`[FILE_UPLOAD_START] Uploading file to storage: ${originalFileName}`);
      const storedFileName = await this.fileStorageService.uploadFile(
        excelFileBuffer, 
        originalFileName, 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      
      const fileUrl = this.fileStorageService.getFileUrl(storedFileName);
      this.logger.log(`[FILE_UPLOADED] File uploaded successfully - Original: ${originalFileName}, Stored: ${storedFileName}`);
      
      // Create File entity
      const fileEntity = FileEntity.create(
        FileNameVO.create(originalFileName),
        FileNameVO.create(storedFileName),
        FileUrlVO.create(fileUrl),
        FileMimeTypeVO.create('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
        FileSizeVO.create(excelFileBuffer.length)
      );
      
      // Save File entity
      this.logger.log(`[FILE_ENTITY_SAVE] Saving file entity to database`);
      await this.fileRepository.save(fileEntity);
      
      this.logger.log(`[FILE_ENTITY_SAVED] File entity saved with ID: ${fileEntity.getId().getValue()}`);
      
      // Create Candidate entity
      const candidate = CandidateEntity.create(
        CandidateNameVO.create(createCandidateDto.firstName, createCandidateDto.lastName),
        SeniorityVO.create(excelData.seniority),
        YearsExperienceVO.create(excelData.yearsOfExperience),
        AvailabilityVO.create(excelData.availability),
        undefined, // id will be auto-generated
        fileEntity.getId()
      );

      const candidateId = candidate.getId().getValue();
      const createdAt = candidate.getCreatedAt();
      
      this.logger.log(`[CANDIDATE_ENTITY_CREATED] Candidate entity created - ID: ${candidateId}, Name: ${createCandidateDto.firstName} ${createCandidateDto.lastName}`);

      // Save Candidate entity
      this.logger.log(`[CANDIDATE_SAVE] Saving candidate to database: ${candidateId}`);
      await this.candidateRepository.save(candidate);

      // Increment business metrics
      this.businessMetricsService.incrementCandidatesCreated(
        excelData.seniority,
        excelData.availability
      );

      const endTime = new Date();
      const processingTime = endTime.getTime() - startTime.getTime();

      this.logger.log(`[CANDIDATE_CREATED_SUCCESS] 🎉 NEW CANDIDATE CREATED SUCCESSFULLY! 🎉 - ID: ${candidateId}, Name: ${createCandidateDto.firstName} ${createCandidateDto.lastName}, Seniority: ${excelData.seniority}, Experience: ${excelData.yearsOfExperience}, Available: ${excelData.availability}, Processing time: ${processingTime}ms`);

      const primitives = candidate.toPrimitives();
      
      return new CandidateResponseDto(
        primitives.id,
        primitives.firstName,
        primitives.lastName,
        primitives.seniority,
        primitives.yearsOfExperience,
        primitives.availability,
        primitives.createdAt,
        fileUrl
      );
    } catch (error) {
      const endTime = new Date();
      const processingTime = endTime.getTime() - startTime.getTime();
      
      this.logger.error(`[CANDIDATE_CREATION_FAILED] ❌ Candidate creation failed - Name: ${createCandidateDto.firstName} ${createCandidateDto.lastName}, File: ${originalFileName}, Error: ${error.message}`, error.stack);
      
      throw error;
    }
  }
}