import { Injectable } from '@nestjs/common';
import { CandidateRepository, PaginationOptions, PaginatedResult } from '../../../domain/candidate/repositories/candidate.repository';
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

  async findWithPagination(options: PaginationOptions): Promise<PaginatedResult<CandidateEntity>> {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'DESC', searchTerm } = options;
    
    let candidates = Array.from(this.candidates.values());

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      candidates = candidates.filter(candidate => {
        const primitives = candidate.toPrimitives();
        return primitives.firstName.toLowerCase().includes(searchLower) ||
               primitives.lastName.toLowerCase().includes(searchLower);
      });
    }

    // Apply sorting
    candidates.sort((a, b) => {
      const aPrimitives = a.toPrimitives();
      const bPrimitives = b.toPrimitives();
      
      let aValue: any = aPrimitives.createdAt;
      let bValue: any = bPrimitives.createdAt;
      
      if (sortBy === 'firstName') {
        aValue = aPrimitives.firstName;
        bValue = bPrimitives.firstName;
      } else if (sortBy === 'lastName') {
        aValue = aPrimitives.lastName;
        bValue = bPrimitives.lastName;
      } else if (sortBy === 'seniority') {
        aValue = aPrimitives.seniority;
        bValue = bPrimitives.seniority;
      } else if (sortBy === 'yearsOfExperience') {
        aValue = aPrimitives.yearsOfExperience;
        bValue = bPrimitives.yearsOfExperience;
      } else if (sortBy === 'availability') {
        aValue = aPrimitives.availability;
        bValue = bPrimitives.availability;
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'ASC' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number') {
        return sortOrder === 'ASC' ? aValue - bValue : bValue - aValue;
      } else if (aValue instanceof Date) {
        return sortOrder === 'ASC' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
      }
      
      return 0;
    });

    const total = candidates.length;
    const skip = (page - 1) * limit;
    const paginatedCandidates = candidates.slice(skip, skip + limit);

    return {
      data: paginatedCandidates,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}