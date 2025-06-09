import { Injectable, Inject } from '@nestjs/common';
import { CandidateRepository } from '../../../domain/candidate/repositories/candidate.repository';
import { CandidateResponseDto } from '../dtos/candidate-response.dto';
import { REPOSITORY_TOKENS } from '../../../shared/constants/tokens';

@Injectable()
export class GetAllCandidatesUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.CANDIDATE_REPOSITORY)
    private readonly candidateRepository: CandidateRepository
  ) {}

  async execute(): Promise<CandidateResponseDto[]> {
    const candidates = await this.candidateRepository.findAll();
    
    return candidates.map(candidate => {
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
    });
  }
}