import { GetAllCandidatesUseCase } from '../get-all-candidates.use-case';
import { CandidateRepository } from '../../../../domain/candidate/repositories/candidate.repository';
import { FileRepository } from '../../../../domain/file/repositories/file.repository';
import { CandidateEntity } from '../../../../domain/candidate/entities/candidate.entity';
import { CandidateNameVO } from '../../../../domain/candidate/value-objects/candidate-name.vo';
import { SeniorityVO } from '../../../../domain/candidate/value-objects/seniority.vo';
import { YearsExperienceVO } from '../../../../domain/candidate/value-objects/years-experience.vo';
import { AvailabilityVO } from '../../../../domain/candidate/value-objects/availability.vo';

describe('GetAllCandidatesUseCase', () => {
  let useCase: GetAllCandidatesUseCase;
  let mockRepository: jest.Mocked<CandidateRepository>;
  let mockFileRepository: jest.Mocked<FileRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findWithPagination: jest.fn(),
      delete: jest.fn(),
    };

    mockFileRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new GetAllCandidatesUseCase(mockRepository, mockFileRepository);
  });

  describe('execute', () => {
    it('should return all candidates as DTOs', async () => {
      const candidate1 = CandidateEntity.create(
        CandidateNameVO.create('John', 'Doe'),
        SeniorityVO.create('Senior'),
        YearsExperienceVO.create(5),
        AvailabilityVO.create(true)
      );

      const candidate2 = CandidateEntity.create(
        CandidateNameVO.create('Jane', 'Smith'),
        SeniorityVO.create('Junior'),
        YearsExperienceVO.create(2),
        AvailabilityVO.create(false)
      );

      mockRepository.findAll.mockResolvedValue([candidate1, candidate2]);

      const result = await useCase.execute();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      
      expect(result[0].firstName).toBe('John');
      expect(result[0].lastName).toBe('Doe');
      expect(result[0].seniority).toBe('Senior');
      expect(result[0].yearsOfExperience).toBe(5);
      expect(result[0].availability).toBe(true);
      
      expect(result[1].firstName).toBe('Jane');
      expect(result[1].lastName).toBe('Smith');
      expect(result[1].seniority).toBe('Junior');
      expect(result[1].yearsOfExperience).toBe(2);
      expect(result[1].availability).toBe(false);
    });

    it('should return empty array when no candidates exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should throw error when repository fails', async () => {
      mockRepository.findAll.mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute()).rejects.toThrow('Database error');
    });
  });
});