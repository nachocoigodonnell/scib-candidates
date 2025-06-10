import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { FileStorageService } from '../../../application/candidate/services/file-storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3FileStorageService implements FileStorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;
  private endpoint: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get('S3_BUCKET_NAME', 'candidates-files');
    this.region = this.configService.get('AWS_REGION', 'us-east-1');
    this.endpoint = this.configService.get('AWS_ENDPOINT');
    
    this.s3Client = new S3Client({
      region: this.region,
      endpoint: this.endpoint,
      forcePathStyle: true, // Required for LocalStack
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID', 'test'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY', 'test'),
      },
    });

    this.ensureBucketExists();
  }

  async uploadFile(file: Buffer, fileName: string, mimeType: string): Promise<string> {
    const uniqueFileName = this.generateUniqueFileName(fileName);
    
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: uniqueFileName,
      Body: file,
      ContentType: mimeType,
    });

    await this.s3Client.send(command);
    return uniqueFileName;
  }

  async downloadFile(fileName: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });

    const response = await this.s3Client.send(command);
    const chunks: Uint8Array[] = [];
    
    if (response.Body) {
      // @ts-ignore - AWS SDK types issue
      for await (const chunk of response.Body) {
        chunks.push(chunk);
      }
    }
    
    return Buffer.concat(chunks);
  }

  getFileUrl(fileName: string): string {
    if (this.endpoint) {
      // For LocalStack, return the direct URL
      return `${this.endpoint}/${this.bucketName}/${fileName}`;
    }
    // For real S3, return the standard URL format
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;
  }

  async deleteFile(fileName: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.warn(`Could not delete file ${fileName} from S3:`, error.message);
    }
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      // Check if bucket exists
      const headCommand = new HeadBucketCommand({
        Bucket: this.bucketName,
      });
      await this.s3Client.send(headCommand);
    } catch (error) {
      // Bucket doesn't exist, create it
      try {
        const createCommand = new CreateBucketCommand({
          Bucket: this.bucketName,
        });
        await this.s3Client.send(createCommand);
        console.log(`Created S3 bucket: ${this.bucketName}`);
      } catch (createError) {
        console.error(`Failed to create S3 bucket: ${this.bucketName}`, createError);
      }
    }
  }

  private generateUniqueFileName(originalName: string): string {
    const uuid = uuidv4();
    const ext = originalName.split('.').pop();
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    return `${nameWithoutExt}-${uuid}.${ext}`;
  }
}