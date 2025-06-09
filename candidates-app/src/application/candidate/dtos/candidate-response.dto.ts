export class CandidateResponseDto {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly seniority: string,
    public readonly yearsOfExperience: number,
    public readonly availability: boolean,
    public readonly createdAt: Date
  ) {}
}