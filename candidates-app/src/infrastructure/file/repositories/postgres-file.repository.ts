import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileRepository } from '../../../domain/file/repositories/file.repository';
import { FileEntity as DomainFileEntity } from '../../../domain/file/entities/file.entity';
import { FileIdVO } from '../../../domain/file/value-objects/file-id.vo';
import { FileEntity as TypeOrmFileEntity } from '../entities/file.entity';

@Injectable()
export class PostgresFileRepository implements FileRepository {
  constructor(
    @InjectRepository(TypeOrmFileEntity)
    private readonly fileRepository: Repository<TypeOrmFileEntity>,
  ) {}

  async save(file: DomainFileEntity): Promise<void> {
    const fileEntity = this.toTypeOrmEntity(file);
    await this.fileRepository.save(fileEntity);
  }

  async findById(id: FileIdVO): Promise<DomainFileEntity | null> {
    const entity = await this.fileRepository.findOne({
      where: { id: id.getValue() },
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findAll(): Promise<DomainFileEntity[]> {
    const entities = await this.fileRepository.find({
      order: { uploadedAt: 'DESC' },
    });
    return entities.map(entity => this.toDomainEntity(entity));
  }

  async delete(id: FileIdVO): Promise<void> {
    await this.fileRepository.delete({ id: id.getValue() });
  }

  private toTypeOrmEntity(file: DomainFileEntity): TypeOrmFileEntity {
    const primitives = file.toPrimitives();
    const entity = new TypeOrmFileEntity();
    entity.id = primitives.id;
    entity.originalName = primitives.originalName;
    entity.storedName = primitives.storedName;
    entity.url = primitives.url;
    entity.mimeType = primitives.mimeType;
    entity.size = primitives.size;
    entity.uploadedAt = primitives.uploadedAt;
    return entity;
  }

  private toDomainEntity(entity: TypeOrmFileEntity): DomainFileEntity {
    return DomainFileEntity.fromPrimitives({
      id: entity.id,
      originalName: entity.originalName,
      storedName: entity.storedName,
      url: entity.url,
      mimeType: entity.mimeType,
      size: entity.size,
      uploadedAt: entity.uploadedAt,
    });
  }
}