import { CandidateNameVO } from '../candidate-name.vo';

describe('CandidateNameVO', () => {
  describe('create', () => {
    it('should create with valid names', () => {
      const name = CandidateNameVO.create('John', 'Doe');
      
      expect(name.getFirstName()).toBe('John');
      expect(name.getLastName()).toBe('Doe');
      expect(name.getFullName()).toBe('John Doe');
      expect(name.toString()).toBe('John Doe');
    });

    it('should trim whitespace', () => {
      const name = CandidateNameVO.create('  John  ', '  Doe  ');
      
      expect(name.getFirstName()).toBe('John');
      expect(name.getLastName()).toBe('Doe');
    });

    it('should throw error for empty first name', () => {
      expect(() => CandidateNameVO.create('', 'Doe')).toThrow('First name cannot be empty');
      expect(() => CandidateNameVO.create('   ', 'Doe')).toThrow('First name cannot be empty');
    });

    it('should throw error for empty last name', () => {
      expect(() => CandidateNameVO.create('John', '')).toThrow('Last name cannot be empty');
      expect(() => CandidateNameVO.create('John', '   ')).toThrow('Last name cannot be empty');
    });
  });

  describe('equals', () => {
    it('should return true for equal names', () => {
      const name1 = CandidateNameVO.create('John', 'Doe');
      const name2 = CandidateNameVO.create('John', 'Doe');
      
      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false for different names', () => {
      const name1 = CandidateNameVO.create('John', 'Doe');
      const name2 = CandidateNameVO.create('Jane', 'Doe');
      
      expect(name1.equals(name2)).toBe(false);
    });
  });
});