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

@Injectable()
export class CreateCandidateUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.CANDIDATE_REPOSITORY)
    private readonly candidateRepository: CandidateRepository,
    @Inject(REPOSITORY_TOKENS.FILE_REPOSITORY)
    private readonly fileRepository: FileRepository,
    @Inject(SERVICE_TOKENS.EXCEL_PARSER_SERVICE)
    private readonly excelParserService: ExcelParserService,
    @Inject(SERVICE_TOKENS.FILE_STORAGE_SERVICE)
    private readonly fileStorageService: FileStorageService
  ) {}

  async execute(
    createCandidateDto: CreateCandidateDto,
    excelFileBuffer: Buffer,
    originalFileName: string
  ): Promise<CandidateResponseDto> {
    const excelData = this.excelParserService.parseExcelFile(excelFileBuffer);
    
    // Upload the Excel file
    const storedFileName = await this.fileStorageService.uploadFile(
      excelFileBuffer, 
      originalFileName, 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    
    const fileUrl = this.fileStorageService.getFileUrl(storedFileName);
    
    // Create File entity
    const fileEntity = FileEntity.create(
      FileNameVO.create(originalFileName),
      FileNameVO.create(storedFileName),
      FileUrlVO.create(fileUrl),
      FileMimeTypeVO.create('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
      FileSizeVO.create(excelFileBuffer.length)
    );
    
    // Save File entity
    await this.fileRepository.save(fileEntity);
    
    const candidate = CandidateEntity.create(
      CandidateNameVO.create(createCandidateDto.firstName, createCandidateDto.lastName),
      SeniorityVO.create(excelData.seniority),
      YearsExperienceVO.create(excelData.yearsOfExperience),
      AvailabilityVO.create(excelData.availability),
      undefined, // id will be auto-generated
      fileEntity.getId()
    );

    await this.candidateRepository.save(candidate);

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
  }
}