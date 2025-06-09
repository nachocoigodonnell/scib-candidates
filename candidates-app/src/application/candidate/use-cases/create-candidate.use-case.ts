import { Injectable, Inject } from '@nestjs/common';
import { CandidateRepository } from '../../../domain/candidate/repositories/candidate.repository';
import { CandidateEntity } from '../../../domain/candidate/entities/candidate.entity';
import { CandidateNameVO } from '../../../domain/candidate/value-objects/candidate-name.vo';
import { SeniorityVO } from '../../../domain/candidate/value-objects/seniority.vo';
import { YearsExperienceVO } from '../../../domain/candidate/value-objects/years-experience.vo';
import { AvailabilityVO } from '../../../domain/candidate/value-objects/availability.vo';
import { CreateCandidateDto } from '../dtos/create-candidate.dto';
import { CandidateResponseDto } from '../dtos/candidate-response.dto';
import { ExcelParserService } from '../services/excel-parser.service';
import { REPOSITORY_TOKENS, SERVICE_TOKENS } from '../../../shared/constants/tokens';

@Injectable()
export class CreateCandidateUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.CANDIDATE_REPOSITORY)
    private readonly candidateRepository: CandidateRepository,
    @Inject(SERVICE_TOKENS.EXCEL_PARSER_SERVICE)
    private readonly excelParserService: ExcelParserService
  ) {}

  async execute(
    createCandidateDto: CreateCandidateDto,
    excelFileBuffer: Buffer
  ): Promise<CandidateResponseDto> {
    const excelData = this.excelParserService.parseExcelFile(excelFileBuffer);
    
    const candidate = CandidateEntity.create(
      CandidateNameVO.create(createCandidateDto.firstName, createCandidateDto.lastName),
      SeniorityVO.create(excelData.seniority),
      YearsExperienceVO.create(excelData.yearsOfExperience),
      AvailabilityVO.create(excelData.availability)
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
      primitives.createdAt
    );
  }
}