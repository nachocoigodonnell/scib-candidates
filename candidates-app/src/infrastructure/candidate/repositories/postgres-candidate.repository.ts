import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateRepository } from '../../../domain/candidate/repositories/candidate.repository';
import { CandidateEntity as DomainCandidateEntity } from '../../../domain/candidate/entities/candidate.entity';
import { CandidateIdVO } from '../../../domain/candidate/value-objects/candidate-id.vo';
import { CandidateEntity as TypeOrmCandidateEntity } from '../entities/candidate.entity';

@Injectable()
export class PostgresCandidateRepository implements CandidateRepository {
  constructor(
    @InjectRepository(TypeOrmCandidateEntity)
    private readonly candidateRepository: Repository<TypeOrmCandidateEntity>,
  ) {}

  async save(candidate: DomainCandidateEntity): Promise<void> {
    const candidateEntity = this.toTypeOrmEntity(candidate);
    await this.candidateRepository.save(candidateEntity);
  }

  async findAll(): Promise<DomainCandidateEntity[]> {
    const entities = await this.candidateRepository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map(entity => this.toDomainEntity(entity));
  }

  async findById(id: CandidateIdVO): Promise<DomainCandidateEntity | null> {
    const entity = await this.candidateRepository.findOne({
      where: { id: id.getValue() },
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async delete(id: CandidateIdVO): Promise<void> {
    await this.candidateRepository.delete({ id: id.getValue() });
  }

  private toTypeOrmEntity(candidate: DomainCandidateEntity): TypeOrmCandidateEntity {
    const primitives = candidate.toPrimitives();
    const entity = new TypeOrmCandidateEntity();
    entity.id = primitives.id;
    entity.firstName = primitives.firstName;
    entity.lastName = primitives.lastName;
    entity.seniority = primitives.seniority;
    entity.yearsOfExperience = primitives.yearsOfExperience;
    entity.availability = primitives.availability;
    entity.createdAt = primitives.createdAt;
    return entity;
  }

  private toDomainEntity(entity: TypeOrmCandidateEntity): DomainCandidateEntity {
    return DomainCandidateEntity.fromPrimitives({
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      seniority: entity.seniority,
      yearsOfExperience: entity.yearsOfExperience,
      availability: entity.availability,
      createdAt: entity.createdAt,
    });
  }
}