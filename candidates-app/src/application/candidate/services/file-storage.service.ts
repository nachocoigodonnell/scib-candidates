export interface FileStorageService {
  uploadFile(file: Buffer, fileName: string, mimeType: string): Promise<string>;
  downloadFile(fileName: string): Promise<Buffer>;
  getFileUrl(fileName: string): string;
  deleteFile(fileName: string): Promise<void>;
}