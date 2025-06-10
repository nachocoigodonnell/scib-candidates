import { CandidateEntity } from '../entities/candidate.entity';
import { CandidateIdVO } from '../value-objects/candidate-id.vo';

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  searchTerm?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CandidateRepository {
  save(candidate: CandidateEntity): Promise<void>;
  findById(id: CandidateIdVO): Promise<CandidateEntity | null>;
  findAll(): Promise<CandidateEntity[]>;
  findWithPagination(options: PaginationOptions): Promise<PaginatedResult<CandidateEntity>>;
  delete(id: CandidateIdVO): Promise<void>;
}