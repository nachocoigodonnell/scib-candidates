export class YearsExperienceVO {
  private constructor(private readonly value: number) {}

  static create(value: number): YearsExperienceVO {
    if (isNaN(value) || value < 0) {
      throw new Error('Years of experience must be a non-negative number');
    }
    
    return new YearsExperienceVO(value);
  }

  getValue(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }

  equals(other: YearsExperienceVO): boolean {
    return this.value === other.value;
  }
}