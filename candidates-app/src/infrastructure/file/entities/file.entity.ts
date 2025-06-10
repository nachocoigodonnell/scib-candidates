import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('files')
export class FileEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'original_name', length: 255 })
  originalName: string;

  @Column({ name: 'stored_name', length: 255 })
  storedName: string;

  @Column({ length: 2048 })
  url: string;

  @Column({ name: 'mime_type', length: 100 })
  mimeType: string;

  @Column({ type: 'int' })
  size: number;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;
}