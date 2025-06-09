import { SeniorityVO, Seniority } from '../seniority.vo';

describe('SeniorityVO', () => {
  describe('create', () => {
    it('should create Junior seniority from "junior" string', () => {
      const seniority = SeniorityVO.create('junior');
      
      expect(seniority.getValue()).toBe(Seniority.JUNIOR);
      expect(seniority.toString()).toBe('Junior');
    });

    it('should create Senior seniority from "senior" string', () => {
      const seniority = SeniorityVO.create('senior');
      
      expect(seniority.getValue()).toBe(Seniority.SENIOR);
      expect(seniority.toString()).toBe('Senior');
    });

    it('should handle case insensitive input', () => {
      const juniorSeniority = SeniorityVO.create('JUNIOR');
      const seniorSeniority = SeniorityVO.create('Senior');
      
      expect(juniorSeniority.getValue()).toBe(Seniority.JUNIOR);
      expect(seniorSeniority.getValue()).toBe(Seniority.SENIOR);
    });

    it('should throw error for invalid seniority', () => {
      expect(() => SeniorityVO.create('invalid')).toThrow('Seniority must be "Junior" or "Senior"');
      expect(() => SeniorityVO.create('')).toThrow('Seniority must be "Junior" or "Senior"');
    });
  });

  describe('equals', () => {
    it('should return true for equal seniorities', () => {
      const seniority1 = SeniorityVO.create('junior');
      const seniority2 = SeniorityVO.create('junior');
      
      expect(seniority1.equals(seniority2)).toBe(true);
    });

    it('should return false for different seniorities', () => {
      const juniorSeniority = SeniorityVO.create('junior');
      const seniorSeniority = SeniorityVO.create('senior');
      
      expect(juniorSeniority.equals(seniorSeniority)).toBe(false);
    });
  });
});