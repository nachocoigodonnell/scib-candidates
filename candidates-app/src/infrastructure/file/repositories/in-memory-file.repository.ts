import { FileRepository } from '../../../domain/file/repositories/file.repository';
import { FileEntity } from '../../../domain/file/entities/file.entity';
import { FileIdVO } from '../../../domain/file/value-objects/file-id.vo';

export class InMemoryFileRepository implements FileRepository {
  private files: Map<string, FileEntity> = new Map();

  async save(file: FileEntity): Promise<void> {
    const id = file.getId().getValue();
    this.files.set(id, file);
  }

  async findById(id: FileIdVO): Promise<FileEntity | null> {
    const file = this.files.get(id.getValue());
    return file || null;
  }

  async findAll(): Promise<FileEntity[]> {
    return Array.from(this.files.values());
  }

  async delete(id: FileIdVO): Promise<void> {
    this.files.delete(id.getValue());
  }
}