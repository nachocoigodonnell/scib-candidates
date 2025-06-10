import { Injectable, Inject } from '@nestjs/common';
import { CandidateRepository } from '../../../domain/candidate/repositories/candidate.repository';
import { FileRepository } from '../../../domain/file/repositories/file.repository';
import { FileIdVO } from '../../../domain/file/value-objects/file-id.vo';
import { CandidateResponseDto } from '../dtos/candidate-response.dto';
import { REPOSITORY_TOKENS } from '../../../shared/constants/tokens';

@Injectable()
export class GetAllCandidatesUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.CANDIDATE_REPOSITORY)
    private readonly candidateRepository: CandidateRepository,
    @Inject(REPOSITORY_TOKENS.FILE_REPOSITORY)
    private readonly fileRepository: FileRepository
  ) {}

  async execute(): Promise<CandidateResponseDto[]> {
    const candidates = await this.candidateRepository.findAll();
    
    const candidatePromises = candidates.map(async candidate => {
      const primitives = candidate.toPrimitives();
      let fileUrl: string | undefined;
      
      if (primitives.fileId) {
        const file = await this.fileRepository.findById(
          FileIdVO.create(primitives.fileId)
        );
        fileUrl = file?.getUrl().getValue();
      }
      
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
    });
    
    return Promise.all(candidatePromises);
  }
}