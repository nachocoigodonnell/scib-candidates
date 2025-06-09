import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('candidates')
export class CandidateEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ length: 20 })
  seniority: string;

  @Column({ name: 'years_of_experience', type: 'int' })
  yearsOfExperience: number;

  @Column()
  availability: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}