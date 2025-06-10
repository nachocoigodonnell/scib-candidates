import { FileEntity } from '../entities/file.entity';
import { FileIdVO } from '../value-objects/file-id.vo';

export interface FileRepository {
  save(file: FileEntity): Promise<void>;
  findById(id: FileIdVO): Promise<FileEntity | null>;
  findAll(): Promise<FileEntity[]>;
  delete(id: FileIdVO): Promise<void>;
}