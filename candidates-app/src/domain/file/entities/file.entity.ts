import { FileIdVO } from '../value-objects/file-id.vo';
import { FileNameVO } from '../value-objects/file-name.vo';
import { FileUrlVO } from '../value-objects/file-url.vo';
import { FileMimeTypeVO } from '../value-objects/file-mime-type.vo';
import { FileSizeVO } from '../value-objects/file-size.vo';

export interface FileEntityPrimitives {
  id: string;
  originalName: string;
  storedName: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}

export class FileEntity {
  private constructor(
    private readonly id: FileIdVO,
    private readonly originalName: FileNameVO,
    private readonly storedName: FileNameVO,
    private readonly url: FileUrlVO,
    private readonly mimeType: FileMimeTypeVO,
    private readonly size: FileSizeVO,
    private readonly uploadedAt: Date
  ) {}

  static create(
    originalName: FileNameVO,
    storedName: FileNameVO,
    url: FileUrlVO,
    mimeType: FileMimeTypeVO,
    size: FileSizeVO,
    id?: FileIdVO,
    uploadedAt?: Date
  ): FileEntity {
    return new FileEntity(
      id || FileIdVO.generate(),
      originalName,
      storedName,
      url,
      mimeType,
      size,
      uploadedAt || new Date()
    );
  }

  static fromPrimitives(primitives: FileEntityPrimitives): FileEntity {
    return new FileEntity(
      FileIdVO.create(primitives.id),
      FileNameVO.create(primitives.originalName),
      FileNameVO.create(primitives.storedName),
      FileUrlVO.create(primitives.url),
      FileMimeTypeVO.create(primitives.mimeType),
      FileSizeVO.create(primitives.size),
      primitives.uploadedAt
    );
  }

  getId(): FileIdVO {
    return this.id;
  }

  getOriginalName(): FileNameVO {
    return this.originalName;
  }

  getStoredName(): FileNameVO {
    return this.storedName;
  }

  getUrl(): FileUrlVO {
    return this.url;
  }

  getMimeType(): FileMimeTypeVO {
    return this.mimeType;
  }

  getSize(): FileSizeVO {
    return this.size;
  }

  getUploadedAt(): Date {
    return this.uploadedAt;
  }

  toPrimitives(): FileEntityPrimitives {
    return {
      id: this.id.getValue(),
      originalName: this.originalName.getValue(),
      storedName: this.storedName.getValue(),
      url: this.url.getValue(),
      mimeType: this.mimeType.getValue(),
      size: this.size.getValue(),
      uploadedAt: this.uploadedAt
    };
  }
}