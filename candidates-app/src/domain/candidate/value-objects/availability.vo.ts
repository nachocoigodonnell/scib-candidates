export class AvailabilityVO {
  private constructor(private readonly value: boolean) {}

  static create(value: any): AvailabilityVO {
    if (typeof value === 'boolean') {
      return new AvailabilityVO(value);
    }
    
    if (typeof value === 'string') {
      const normalizedValue = value.trim().toLowerCase();
      if (normalizedValue === 'true') {
        return new AvailabilityVO(true);
      } else if (normalizedValue === 'false') {
        return new AvailabilityVO(false);
      }
    }
    
    throw new Error('Availability must be true or false');
  }

  getValue(): boolean {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }

  equals(other: AvailabilityVO): boolean {
    return this.value === other.value;
  }

  isAvailable(): boolean {
    return this.value;
  }

  isNotAvailable(): boolean {
    return !this.value;
  }
}