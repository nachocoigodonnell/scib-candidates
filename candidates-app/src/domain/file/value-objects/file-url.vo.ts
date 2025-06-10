export class FileUrlVO {
  private constructor(private readonly value: string) {
    this.ensureValidUrl(value);
  }

  static create(value: string): FileUrlVO {
    return new FileUrlVO(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: FileUrlVO): boolean {
    return this.value === other.value;
  }

  private ensureValidUrl(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('File URL cannot be empty');
    }
    
    if (value.length > 2048) {
      throw new Error('File URL cannot exceed 2048 characters');
    }
  }
}