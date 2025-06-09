import { CandidateEntity } from '../candidate.entity';
import { CandidateNameVO } from '../../value-objects/candidate-name.vo';
import { SeniorityVO, Seniority } from '../../value-objects/seniority.vo';
import { YearsExperienceVO } from '../../value-objects/years-experience.vo';
import { AvailabilityVO } from '../../value-objects/availability.vo';
import { CandidateIdVO } from '../../value-objects/candidate-id.vo';

describe('CandidateEntity', () => {
  describe('create', () => {
    it('should create a candidate with all required data', () => {
      const name = CandidateNameVO.create('John', 'Doe');
      const seniority = SeniorityVO.create('Senior');
      const years = YearsExperienceVO.create(5);
      const availability = AvailabilityVO.create(true);

      const candidate = CandidateEntity.create(name, seniority, years, availability);

      expect(candidate.getName()).toBe(name);
      expect(candidate.getSeniority()).toBe(seniority);
      expect(candidate.getYearsOfExperience()).toBe(years);
      expect(candidate.getAvailability()).toBe(availability);
      expect(candidate.getId()).toBeDefined();
      expect(candidate.getCreatedAt()).toBeInstanceOf(Date);
      expect(candidate.isAvailable()).toBe(true);
    });

    it('should create a candidate with provided ID', () => {
      const id = CandidateIdVO.create('test-id');
      const name = CandidateNameVO.create('John', 'Doe');
      const seniority = SeniorityVO.create('Junior');
      const years = YearsExperienceVO.create(2);
      const availability = AvailabilityVO.create(false);

      const candidate = CandidateEntity.create(name, seniority, years, availability, id);

      expect(candidate.getId().getValue()).toBe('test-id');
      expect(candidate.isAvailable()).toBe(false);
    });
  });

  describe('fromPrimitives', () => {
    it('should create candidate from primitive data', () => {
      const primitiveData = {
        id: 'test-id',
        firstName: 'Jane',
        lastName: 'Smith',
        seniority: 'Senior',
        yearsOfExperience: 8,
        availability: true,
        createdAt: new Date('2023-01-01'),
      };

      const candidate = CandidateEntity.fromPrimitives(primitiveData);

      expect(candidate.getId().getValue()).toBe('test-id');
      expect(candidate.getName().getFirstName()).toBe('Jane');
      expect(candidate.getName().getLastName()).toBe('Smith');
      expect(candidate.getSeniority().getValue()).toBe(Seniority.SENIOR);
      expect(candidate.getYearsOfExperience().getValue()).toBe(8);
      expect(candidate.getAvailability().getValue()).toBe(true);
      expect(candidate.getCreatedAt()).toEqual(new Date('2023-01-01'));
    });
  });

  describe('toPrimitives', () => {
    it('should convert candidate to primitive data', () => {
      const name = CandidateNameVO.create('John', 'Doe');
      const seniority = SeniorityVO.create('Junior');
      const years = YearsExperienceVO.create(3);
      const availability = AvailabilityVO.create(false);
      const id = CandidateIdVO.create('test-id');

      const candidate = CandidateEntity.create(name, seniority, years, availability, id);
      const primitives = candidate.toPrimitives();

      expect(primitives.id).toBe('test-id');
      expect(primitives.firstName).toBe('John');
      expect(primitives.lastName).toBe('Doe');
      expect(primitives.seniority).toBe(Seniority.JUNIOR);
      expect(primitives.yearsOfExperience).toBe(3);
      expect(primitives.availability).toBe(false);
      expect(primitives.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('isAvailable', () => {
    it('should return true when candidate is available', () => {
      const name = CandidateNameVO.create('John', 'Doe');
      const seniority = SeniorityVO.create('Senior');
      const years = YearsExperienceVO.create(5);
      const availability = AvailabilityVO.create(true);

      const candidate = CandidateEntity.create(name, seniority, years, availability);

      expect(candidate.isAvailable()).toBe(true);
    });

    it('should return false when candidate is not available', () => {
      const name = CandidateNameVO.create('John', 'Doe');
      const seniority = SeniorityVO.create('Senior');
      const years = YearsExperienceVO.create(5);
      const availability = AvailabilityVO.create(false);

      const candidate = CandidateEntity.create(name, seniority, years, availability);

      expect(candidate.isAvailable()).toBe(false);
    });
  });
});