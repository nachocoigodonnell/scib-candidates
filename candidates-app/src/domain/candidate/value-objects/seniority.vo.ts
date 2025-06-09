export enum Seniority {
  JUNIOR = 'Junior',
  SENIOR = 'Senior',
}

export class SeniorityVO {
  private constructor(private readonly value: Seniority) {}

  static create(value: string): SeniorityVO {
    const normalizedValue = value.trim().toLowerCase();
    
    if (normalizedValue === 'junior') {
      return new SeniorityVO(Seniority.JUNIOR);
    } else if (normalizedValue === 'senior') {
      return new SeniorityVO(Seniority.SENIOR);
    } else {
      throw new Error('Seniority must be "Junior" or "Senior"');
    }
  }

  static fromEnum(seniority: Seniority): SeniorityVO {
    return new SeniorityVO(seniority);
  }

  getValue(): Seniority {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: SeniorityVO): boolean {
    return this.value === other.value;
  }
}