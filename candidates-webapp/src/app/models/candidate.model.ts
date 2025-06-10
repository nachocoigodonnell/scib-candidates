export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  seniority: 'Junior' | 'Senior';
  yearsOfExperience: number;
  availability: boolean;
  createdAt: Date;
  fileUrl?: string;
}

export interface CreateCandidateRequest {
  firstName: string;
  lastName: string;
}