import { YearsExperienceVO } from '../years-experience.vo';

describe('YearsExperienceVO', () => {
  describe('create', () => {
    it('should create with valid positive number', () => {
      const years = YearsExperienceVO.create(5);
      
      expect(years.getValue()).toBe(5);
      expect(years.toString()).toBe('5');
    });

    it('should create with zero years', () => {
      const years = YearsExperienceVO.create(0);
      
      expect(years.getValue()).toBe(0);
    });

    it('should throw error for negative years', () => {
      expect(() => YearsExperienceVO.create(-1)).toThrow('Years of experience must be a non-negative number');
    });

    it('should throw error for NaN', () => {
      expect(() => YearsExperienceVO.create(NaN)).toThrow('Years of experience must be a non-negative number');
    });
  });

  describe('equals', () => {
    it('should return true for equal years', () => {
      const years1 = YearsExperienceVO.create(3);
      const years2 = YearsExperienceVO.create(3);
      
      expect(years1.equals(years2)).toBe(true);
    });

    it('should return false for different years', () => {
      const years1 = YearsExperienceVO.create(3);
      const years2 = YearsExperienceVO.create(5);
      
      expect(years1.equals(years2)).toBe(false);
    });
  });
});