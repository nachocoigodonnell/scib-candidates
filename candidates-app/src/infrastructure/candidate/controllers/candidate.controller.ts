import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  Res,
  NotFoundException,
  Inject,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCandidateUseCase } from '../../../application/candidate/use-cases/create-candidate.use-case';
import { GetAllCandidatesUseCase } from '../../../application/candidate/use-cases/get-all-candidates.use-case';
import { CreateCandidateDto } from '../../../application/candidate/dtos/create-candidate.dto';
import { CandidateResponseDto } from '../../../application/candidate/dtos/candidate-response.dto';
import { FileStorageService } from '../../../application/candidate/services/file-storage.service';
import { CandidateRepository } from '../../../domain/candidate/repositories/candidate.repository';
import { FileRepository } from '../../../domain/file/repositories/file.repository';
import { CandidateIdVO } from '../../../domain/candidate/value-objects/candidate-id.vo';
import { SERVICE_TOKENS, REPOSITORY_TOKENS } from '../../../shared/constants/tokens';

@Controller('candidates')
export class CandidateController {
  constructor(
    private readonly createCandidateUseCase: CreateCandidateUseCase,
    private readonly getAllCandidatesUseCase: GetAllCandidatesUseCase,
    @Inject(SERVICE_TOKENS.FILE_STORAGE_SERVICE)
    private readonly fileStorageService: FileStorageService,
    @Inject(REPOSITORY_TOKENS.CANDIDATE_REPOSITORY)
    private readonly candidateRepository: CandidateRepository,
    @Inject(REPOSITORY_TOKENS.FILE_REPOSITORY)
    private readonly fileRepository: FileRepository
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('excelFile'))
  async createCandidate(
    @Body() body: { firstName: string; lastName: string },
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CandidateResponseDto> {
    if (!file) {
      throw new BadRequestException('Excel file is required');
    }

    if (!body.firstName || !body.lastName) {
      throw new BadRequestException('First name and last name are required');
    }

    const createCandidateDto = new CreateCandidateDto(body.firstName, body.lastName);
    
    return await this.createCandidateUseCase.execute(createCandidateDto, file.buffer, file.originalname);
  }

  @Get()
  async getAllCandidates(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ): Promise<CandidateResponseDto[] | any> {
    // If no pagination parameters, return all candidates (backwards compatibility)
    if (!page && !limit) {
      return await this.getAllCandidatesUseCase.execute();
    }

    const pageNumber = parseInt(page || '1', 10);
    const limitNumber = parseInt(limit || '10', 10);

    if (pageNumber < 1 || limitNumber < 1 || limitNumber > 100) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const paginationOptions = {
      page: pageNumber,
      limit: limitNumber,
      sortBy,
      sortOrder: sortOrder || 'DESC',
      searchTerm: search,
    };

    return await this.getAllCandidatesUseCase.executeWithPagination(paginationOptions);
  }

  @Get(':id/download-file')
  async downloadFile(
    @Param('id') id: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      const candidateId = CandidateIdVO.create(id);
      const candidate = await this.candidateRepository.findById(candidateId);
      
      if (!candidate) {
        throw new NotFoundException('Candidate not found');
      }

      const fileId = candidate.getFileId();
      if (!fileId) {
        throw new NotFoundException('No file found for this candidate');
      }

      const file = await this.fileRepository.findById(fileId);
      if (!file) {
        throw new NotFoundException('File not found');
      }
      
      // Get stored filename for download
      const storedFileName = file.getStoredName().getValue();
      const originalFileName = file.getOriginalName().getValue();
      
      // Get file buffer from storage service
      const fileBuffer = await this.fileStorageService.downloadFile(storedFileName);
      
      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${originalFileName}"`);
      
      // Send file
      res.send(fileBuffer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error downloading file');
    }
  }
}