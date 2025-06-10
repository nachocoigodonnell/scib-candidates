import { CreateCandidateUseCase } from '../create-candidate.use-case';
import { CandidateRepository } from '../../../../domain/candidate/repositories/candidate.repository';
import { FileRepository } from '../../../../domain/file/repositories/file.repository';
import { ExcelParserService } from '../../services/excel-parser.service';
import { FileStorageService } from '../../services/file-storage.service';
import { CreateCandidateDto, CandidateDataFromExcelDto } from '../../dtos/create-candidate.dto';
import { CandidateEntity } from '../../../../domain/candidate/entities/candidate.entity';

describe('CreateCandidateUseCase', () => {
  let useCase: CreateCandidateUseCase;
  let mockRepository: jest.Mocked<CandidateRepository>;
  let mockFileRepository: jest.Mocked<FileRepository>;
  let mockExcelParser: jest.Mocked<ExcelParserService>;
  let mockFileStorage: jest.Mocked<FileStorageService>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findWithPagination: jest.fn(),
      delete: jest.fn(),
    };

    mockFileRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    mockExcelParser = {
      parseExcelFile: jest.fn(),
    };

    mockFileStorage = {
      uploadFile: jest.fn(),
      downloadFile: jest.fn(),
      getFileUrl: jest.fn(),
      deleteFile: jest.fn(),
    };

    useCase = new CreateCandidateUseCase(mockRepository, mockFileRepository, mockExcelParser, mockFileStorage);
  });

  describe('execute', () => {
    it('should create and save a candidate successfully', async () => {
      const createDto = new CreateCandidateDto('John', 'Doe');
      const excelBuffer = Buffer.from('mock excel data');
      const excelData = new CandidateDataFromExcelDto('Senior', 5, true);

      mockExcelParser.parseExcelFile.mockReturnValue(excelData);
      mockFileStorage.uploadFile.mockResolvedValue('stored-file-name.xlsx');
      mockFileStorage.getFileUrl.mockReturnValue('http://example.com/file-url');
      mockFileRepository.save.mockResolvedValue();
      mockRepository.save.mockResolvedValue();

      const result = await useCase.execute(createDto, excelBuffer, 'test.xlsx');

      expect(mockExcelParser.parseExcelFile).toHaveBeenCalledWith(excelBuffer);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.any(CandidateEntity));
      
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.seniority).toBe('Senior');
      expect(result.yearsOfExperience).toBe(5);
      expect(result.availability).toBe(true);
      expect(result.fileUrl).toBe('http://example.com/file-url');
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error when excel parsing fails', async () => {
      const createDto = new CreateCandidateDto('John', 'Doe');
      const excelBuffer = Buffer.from('invalid excel data');

      mockExcelParser.parseExcelFile.mockImplementation(() => {
        throw new Error('Invalid Excel format');
      });

      await expect(useCase.execute(createDto, excelBuffer, 'test.xlsx')).rejects.toThrow('Invalid Excel format');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when repository save fails', async () => {
      const createDto = new CreateCandidateDto('John', 'Doe');
      const excelBuffer = Buffer.from('mock excel data');
      const excelData = new CandidateDataFromExcelDto('Junior', 2, false);

      mockExcelParser.parseExcelFile.mockReturnValue(excelData);
      mockFileStorage.uploadFile.mockResolvedValue('stored-file-name.xlsx');
      mockFileStorage.getFileUrl.mockReturnValue('http://example.com/file-url');
      mockFileRepository.save.mockResolvedValue();
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute(createDto, excelBuffer, 'test.xlsx')).rejects.toThrow('Database error');
    });
  });
});