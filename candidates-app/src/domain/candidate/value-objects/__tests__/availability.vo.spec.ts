import { AvailabilityVO } from '../availability.vo';

describe('AvailabilityVO', () => {
  describe('create', () => {
    it('should create with boolean true', () => {
      const availability = AvailabilityVO.create(true);
      
      expect(availability.getValue()).toBe(true);
      expect(availability.isAvailable()).toBe(true);
      expect(availability.isNotAvailable()).toBe(false);
    });

    it('should create with boolean false', () => {
      const availability = AvailabilityVO.create(false);
      
      expect(availability.getValue()).toBe(false);
      expect(availability.isAvailable()).toBe(false);
      expect(availability.isNotAvailable()).toBe(true);
    });

    it('should create with string "true"', () => {
      const availability = AvailabilityVO.create('true');
      
      expect(availability.getValue()).toBe(true);
    });

    it('should create with string "false"', () => {
      const availability = AvailabilityVO.create('false');
      
      expect(availability.getValue()).toBe(false);
    });

    it('should handle case insensitive strings', () => {
      const availabilityTrue = AvailabilityVO.create('TRUE');
      const availabilityFalse = AvailabilityVO.create('False');
      
      expect(availabilityTrue.getValue()).toBe(true);
      expect(availabilityFalse.getValue()).toBe(false);
    });

    it('should throw error for invalid values', () => {
      expect(() => AvailabilityVO.create('invalid')).toThrow('Availability must be true or false');
      expect(() => AvailabilityVO.create(123)).toThrow('Availability must be true or false');
      expect(() => AvailabilityVO.create(null)).toThrow('Availability must be true or false');
    });
  });

  describe('equals', () => {
    it('should return true for equal availability', () => {
      const availability1 = AvailabilityVO.create(true);
      const availability2 = AvailabilityVO.create('true');
      
      expect(availability1.equals(availability2)).toBe(true);
    });

    it('should return false for different availability', () => {
      const availabilityTrue = AvailabilityVO.create(true);
      const availabilityFalse = AvailabilityVO.create(false);
      
      expect(availabilityTrue.equals(availabilityFalse)).toBe(false);
    });
  });
});