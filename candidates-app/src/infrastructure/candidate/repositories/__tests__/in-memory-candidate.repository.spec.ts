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

  describe('findWithPagination', () => {
    beforeEach(async () => {
      // Add test data
      const candidates = [
        createTestCandidateWithDetails('Alice', 'Anderson', 'Senior', 8, true),
        createTestCandidateWithDetails('Bob', 'Brown', 'Junior', 2, false),
        createTestCandidateWithDetails('Charlie', 'Clark', 'Senior', 5, true),
        createTestCandidateWithDetails('Diana', 'Davis', 'Junior', 1, true),
        createTestCandidateWithDetails('Edward', 'Evans', 'Senior', 10, false),
      ];

      for (const candidate of candidates) {
        await repository.save(candidate);
      }
    });

    it('should return paginated results', async () => {
      const result = await repository.findWithPagination({
        page: 1,
        limit: 2,
        sortBy: 'firstName',
        sortOrder: 'ASC'
      });

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(5);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(2);
      expect(result.totalPages).toBe(3);
      expect(result.data[0].getName().getFirstName()).toBe('Alice');
      expect(result.data[1].getName().getFirstName()).toBe('Bob');
    });

    it('should handle search filtering', async () => {
      const result = await repository.findWithPagination({
        page: 1,
        limit: 10,
        searchTerm: 'Alice'
      });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.data[0].getName().getFirstName()).toBe('Alice');
    });

    it('should sort by different fields', async () => {
      const result = await repository.findWithPagination({
        page: 1,
        limit: 10,
        sortBy: 'yearsOfExperience',
        sortOrder: 'DESC'
      });

      expect(result.data[0].getYearsOfExperience().getValue()).toBe(10);
      expect(result.data[1].getYearsOfExperience().getValue()).toBe(8);
    });

    it('should handle empty search results', async () => {
      const result = await repository.findWithPagination({
        page: 1,
        limit: 10,
        searchTerm: 'NonExistent'
      });

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
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

  function createTestCandidateWithDetails(
    firstName: string, 
    lastName: string, 
    seniority: string, 
    yearsOfExperience: number, 
    availability: boolean
  ): CandidateEntity {
    return CandidateEntity.create(
      CandidateNameVO.create(firstName, lastName),
      SeniorityVO.create(seniority),
      YearsExperienceVO.create(yearsOfExperience),
      AvailabilityVO.create(availability)
    );
  }
});