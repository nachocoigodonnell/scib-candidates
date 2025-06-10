import { v4 as uuidv4 } from 'uuid';

export class FileIdVO {
  private constructor(private readonly value: string) {
    this.ensureValidUuid(value);
  }

  static create(value: string): FileIdVO {
    return new FileIdVO(value);
  }

  static generate(): FileIdVO {
    return new FileIdVO(uuidv4());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: FileIdVO): boolean {
    return this.value === other.value;
  }

  private ensureValidUuid(value: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
  }
}