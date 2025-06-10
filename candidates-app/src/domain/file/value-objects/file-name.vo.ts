export class FileNameVO {
  private constructor(private readonly value: string) {
    this.ensureValidFileName(value);
  }

  static create(value: string): FileNameVO {
    return new FileNameVO(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: FileNameVO): boolean {
    return this.value === other.value;
  }

  private ensureValidFileName(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('File name cannot be empty');
    }
    
    if (value.length > 255) {
      throw new Error('File name cannot exceed 255 characters');
    }
    
    // Check for invalid characters in file names
    const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (invalidChars.test(value)) {
      throw new Error('File name contains invalid characters');
    }
  }
}