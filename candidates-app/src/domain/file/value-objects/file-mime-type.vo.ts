export class FileMimeTypeVO {
  private static readonly ALLOWED_MIME_TYPES = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv', // .csv
    'application/pdf', // .pdf
  ];

  private constructor(private readonly value: string) {
    this.ensureValidMimeType(value);
  }

  static create(value: string): FileMimeTypeVO {
    return new FileMimeTypeVO(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: FileMimeTypeVO): boolean {
    return this.value === other.value;
  }

  isExcelFile(): boolean {
    return this.value === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
           this.value === 'application/vnd.ms-excel';
  }

  private ensureValidMimeType(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('MIME type cannot be empty');
    }
    
    if (!FileMimeTypeVO.ALLOWED_MIME_TYPES.includes(value)) {
      throw new Error(`Unsupported MIME type: ${value}. Allowed types: ${FileMimeTypeVO.ALLOWED_MIME_TYPES.join(', ')}`);
    }
  }
}