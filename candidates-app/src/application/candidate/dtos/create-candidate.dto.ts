export class CreateCandidateDto {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string
  ) {}
}

export class CandidateDataFromExcelDto {
  constructor(
    public readonly seniority: string,
    public readonly yearsOfExperience: number,
    public readonly availability: boolean
  ) {}
}