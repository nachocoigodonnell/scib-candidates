import { Injectable } from '@nestjs/common';
import { FileStorageService } from '../../../application/candidate/services/file-storage.service';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LocalFileStorageService implements FileStorageService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    this.ensureUploadDirExists();
  }

  async uploadFile(file: Buffer, fileName: string, mimeType: string): Promise<string> {
    const uniqueFileName = this.generateUniqueFileName(fileName);
    const filePath = path.join(this.uploadDir, uniqueFileName);
    
    await fs.writeFile(filePath, file);
    return uniqueFileName;
  }

  async downloadFile(fileName: string): Promise<Buffer> {
    const filePath = path.join(this.uploadDir, fileName);
    return await fs.readFile(filePath);
  }

  getFileUrl(fileName: string): string {
    return `/uploads/${fileName}`;
  }

  async deleteFile(fileName: string): Promise<void> {
    const filePath = path.join(this.uploadDir, fileName);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // File might not exist, which is fine
      console.warn(`Could not delete file ${fileName}:`, error.message);
    }
  }

  private async ensureUploadDirExists(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  private generateUniqueFileName(originalName: string): string {
    const uuid = uuidv4();
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);
    return `${nameWithoutExt}-${uuid}${ext}`;
  }
}