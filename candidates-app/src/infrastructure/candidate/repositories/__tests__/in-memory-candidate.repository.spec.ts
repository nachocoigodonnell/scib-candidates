import { InMemoryCandidateRepository } from '../in-memory-candidate.repository';
import { CandidateEntity } from '../../../../domain/candidate/entities/candidate.entity';
import { CandidateNameVO } from '../../../../domain/candidate/value-objects/candidate-name.vo';
import { SeniorityVO } from '../../../../domain/candidate/value-objects/seniority.vo';
import { YearsExperienceVO } from '../../../../domain/candidate/value-objects/years-experience.vo';
import { AvailabilityVO } from '../../../../domain/candidate/value-objects/availability.vo';
import { CandidateIdVO } from '../../../../domain/candidate/value-objects/candidate-id.vo';

describe('InMemoryCandidateRepository', () => {
  let repository: InMemoryCandidateRepository;

  beforeEach(() => {
    repository = new InMemoryCandidateRepository();
  });

  describe('save', () => {
    it('should save a candidate', async () => {
      const candidate = createTestCandidate('John', 'Doe');

      await repository.save(candidate);

      const found = await repository.findById(candidate.getId());
      expect(found).toBe(candidate);
    });

    it('should update existing candidate', async () => {
      const candidate = createTestCandidate('John', 'Doe');
      const id = candidate.getId();

      await repository.save(candidate);

      // Create a new candidate with the same ID (simulating update)
      const updatedCandidate = CandidateEntity.create(
        CandidateNameVO.create('John', 'Updated'),
        SeniorityVO.create('Senior'),
        YearsExperienceVO.create(10),
        AvailabilityVO.create(false),
        id
      );

      await repository.save(updatedCandidate);

      const found = await repository.findById(id);
      expect(found?.getName().getLastName()).toBe('Updated');
    });
  });

  describe('findById', () => {
    it('should return candidate when found', async () => {
      const candidate = createTestCandidate('John', 'Doe');
      await repository.save(candidate);

      const found = await repository.findById(candidate.getId());

      expect(found).toBe(candidate);
    });

    it('should return null when candidate not found', async () => {
      const nonExistentId = CandidateIdVO.create('non-existent');

      const found = await repository.findById(nonExistentId);

      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all candidates', async () => {
      const candidate1 = createTestCandidate('John', 'Doe');
      const candidate2 = createTestCandidate('Jane', 'Smith');

      await repository.save(candidate1);
      await repository.save(candidate2);

      const candidates = await repository.findAll();

      expect(candidates).toHaveLength(2);
      expect(candidates).toContain(candidate1);
      expect(candidates).toContain(candidate2);
    });

    it('should return empty array when no candidates exist', async () => {
      const candidates = await repository.findAll();

      expect(candidates).toEqual([]);
    });
  });

  describe('delete', () => {
    it('should delete existing candidate', async () => {
      const candidate = createTestCandidate('John', 'Doe');
      await repository.save(candidate);

      await repository.delete(candidate.getId());

      const found = await repository.findById(candidate.getId());
      expect(found).toBeNull();
    });

    it('should not throw error when deleting non-existent candidate', async () => {
      const nonExistentId = CandidateIdVO.create('non-existent');

      await expect(repository.delete(nonExistentId)).resolves.not.toThrow();
    });
  });

  function createTestCandidate(firstName: string, lastName: string): CandidateEntity {
    return CandidateEntity.create(
      CandidateNameVO.create(firstName, lastName),
      SeniorityVO.create('Junior'),
      YearsExperienceVO.create(2),
      AvailabilityVO.create(true)
    );
  }
});