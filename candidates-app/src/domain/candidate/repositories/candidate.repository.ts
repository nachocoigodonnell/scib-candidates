import { CandidateEntity } from '../entities/candidate.entity';
import { CandidateIdVO } from '../value-objects/candidate-id.vo';

export interface CandidateRepository {
  save(candidate: CandidateEntity): Promise<void>;
  findById(id: CandidateIdVO): Promise<CandidateEntity | null>;
  findAll(): Promise<CandidateEntity[]>;
  delete(id: CandidateIdVO): Promise<void>;
}