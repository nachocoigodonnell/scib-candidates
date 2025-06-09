import { v4 as uuidv4 } from 'uuid';

export class CandidateIdVO {
  private constructor(private readonly value: string) {}

  static create(value?: string): CandidateIdVO {
    const id = value || uuidv4();
    
    if (!id || id.trim().length === 0) {
      throw new Error('Candidate ID cannot be empty');
    }
    
    return new CandidateIdVO(id);
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: CandidateIdVO): boolean {
    return this.value === other.value;
  }
}