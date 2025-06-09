import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCandidateUseCase } from '../../../application/candidate/use-cases/create-candidate.use-case';
import { GetAllCandidatesUseCase } from '../../../application/candidate/use-cases/get-all-candidates.use-case';
import { CreateCandidateDto } from '../../../application/candidate/dtos/create-candidate.dto';
import { CandidateResponseDto } from '../../../application/candidate/dtos/candidate-response.dto';

@Controller('candidates')
export class CandidateController {
  constructor(
    private readonly createCandidateUseCase: CreateCandidateUseCase,
    private readonly getAllCandidatesUseCase: GetAllCandidatesUseCase
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
    
    return await this.createCandidateUseCase.execute(createCandidateDto, file.buffer);
  }

  @Get()
  async getAllCandidates(): Promise<CandidateResponseDto[]> {
    return await this.getAllCandidatesUseCase.execute();
  }
}