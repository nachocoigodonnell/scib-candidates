import { Injectable } from '@nestjs/common';
import { CandidateRepository } from '../../../domain/candidate/repositories/candidate.repository';
import { CandidateEntity } from '../../../domain/candidate/entities/candidate.entity';
import { CandidateIdVO } from '../../../domain/candidate/value-objects/candidate-id.vo';

@Injectable()
export class InMemoryCandidateRepository implements CandidateRepository {
  private candidates: Map<string, CandidateEntity> = new Map();

  async save(candidate: CandidateEntity): Promise<void> {
    this.candidates.set(candidate.getId().getValue(), candidate);
  }

  async findById(id: CandidateIdVO): Promise<CandidateEntity | null> {
    const candidate = this.candidates.get(id.getValue());
    return candidate || null;
  }

  async findAll(): Promise<CandidateEntity[]> {
    return Array.from(this.candidates.values());
  }

  async delete(id: CandidateIdVO): Promise<void> {
    this.candidates.delete(id.getValue());
  }
}