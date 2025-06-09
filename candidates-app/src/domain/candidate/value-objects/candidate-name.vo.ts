export class CandidateNameVO {
  private constructor(
    private readonly firstName: string,
    private readonly lastName: string
  ) {}

  static create(firstName: string, lastName: string): CandidateNameVO {
    if (!firstName || firstName.trim().length === 0) {
      throw new Error('First name cannot be empty');
    }
    
    if (!lastName || lastName.trim().length === 0) {
      throw new Error('Last name cannot be empty');
    }
    
    return new CandidateNameVO(firstName.trim(), lastName.trim());
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  toString(): string {
    return this.getFullName();
  }

  equals(other: CandidateNameVO): boolean {
    return this.firstName === other.firstName && this.lastName === other.lastName;
  }
}