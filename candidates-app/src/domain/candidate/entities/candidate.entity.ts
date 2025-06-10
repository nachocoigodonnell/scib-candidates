import { CandidateIdVO } from '../value-objects/candidate-id.vo';
import { CandidateNameVO } from '../value-objects/candidate-name.vo';
import { SeniorityVO } from '../value-objects/seniority.vo';
import { YearsExperienceVO } from '../value-objects/years-experience.vo';
import { AvailabilityVO } from '../value-objects/availability.vo';
import { FileIdVO } from '../../file/value-objects/file-id.vo';

export class CandidateEntity {
  private constructor(
    private readonly id: CandidateIdVO,
    private readonly name: CandidateNameVO,
    private readonly seniority: SeniorityVO,
    private readonly yearsOfExperience: YearsExperienceVO,
    private readonly availability: AvailabilityVO,
    private readonly createdAt: Date,
    private readonly fileId?: FileIdVO
  ) {}

  static create(
    name: CandidateNameVO,
    seniority: SeniorityVO,
    yearsOfExperience: YearsExperienceVO,
    availability: AvailabilityVO,
    id?: CandidateIdVO,
    fileId?: FileIdVO
  ): CandidateEntity {
    return new CandidateEntity(
      id || CandidateIdVO.create(),
      name,
      seniority,
      yearsOfExperience,
      availability,
      new Date(),
      fileId
    );
  }

  static fromPrimitives(data: {
    id: string;
    firstName: string;
    lastName: string;
    seniority: string;
    yearsOfExperience: number;
    availability: boolean;
    createdAt: Date;
    fileId?: string;
  }): CandidateEntity {
    return new CandidateEntity(
      CandidateIdVO.create(data.id),
      CandidateNameVO.create(data.firstName, data.lastName),
      SeniorityVO.create(data.seniority),
      YearsExperienceVO.create(data.yearsOfExperience),
      AvailabilityVO.create(data.availability),
      data.createdAt,
      data.fileId ? FileIdVO.create(data.fileId) : undefined
    );
  }

  getId(): CandidateIdVO {
    return this.id;
  }

  getName(): CandidateNameVO {
    return this.name;
  }

  getSeniority(): SeniorityVO {
    return this.seniority;
  }

  getYearsOfExperience(): YearsExperienceVO {
    return this.yearsOfExperience;
  }

  getAvailability(): AvailabilityVO {
    return this.availability;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getFileId(): FileIdVO | undefined {
    return this.fileId;
  }

  isAvailable(): boolean {
    return this.availability.isAvailable();
  }

  toPrimitives(): {
    id: string;
    firstName: string;
    lastName: string;
    seniority: string;
    yearsOfExperience: number;
    availability: boolean;
    createdAt: Date;
    fileId?: string;
  } {
    return {
      id: this.id.getValue(),
      firstName: this.name.getFirstName(),
      lastName: this.name.getLastName(),
      seniority: this.seniority.getValue(),
      yearsOfExperience: this.yearsOfExperience.getValue(),
      availability: this.availability.getValue(),
      createdAt: this.createdAt,
      fileId: this.fileId?.getValue(),
    };
  }
}