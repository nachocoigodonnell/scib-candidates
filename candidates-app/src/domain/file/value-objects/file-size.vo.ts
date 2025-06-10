export class FileSizeVO {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  private constructor(private readonly value: number) {
    this.ensureValidSize(value);
  }

  static create(value: number): FileSizeVO {
    return new FileSizeVO(value);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: FileSizeVO): boolean {
    return this.value === other.value;
  }

  getFormattedSize(): string {
    const bytes = this.value;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  private ensureValidSize(value: number): void {
    if (value < 0) {
      throw new Error('File size cannot be negative');
    }
    
    if (value > FileSizeVO.MAX_FILE_SIZE) {
      throw new Error(`File size cannot exceed ${FileSizeVO.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
  }
}