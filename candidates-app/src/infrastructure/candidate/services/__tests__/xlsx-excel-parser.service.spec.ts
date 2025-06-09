import { XlsxExcelParserService } from '../xlsx-excel-parser.service';
import { BadRequestException } from '@nestjs/common';

jest.mock('xlsx', () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn(),
  },
}));

import * as XLSX from 'xlsx';

describe('XlsxExcelParserService', () => {
  let service: XlsxExcelParserService;
  const mockXLSX = XLSX as jest.Mocked<typeof XLSX>;

  beforeEach(() => {
    service = new XlsxExcelParserService();
    jest.clearAllMocks();
  });

  describe('parseExcelFile', () => {
    it('should parse valid Excel file successfully', () => {
      const buffer = Buffer.from('mock excel data');
      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: {},
        },
      };

      const mockData = [
        ['Seniority', 'Years', 'Availability'],
        ['Senior', 5, true],
      ];

      mockXLSX.read.mockReturnValue(mockWorkbook as any);
      (mockXLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);

      const result = service.parseExcelFile(buffer);

      expect(result.seniority).toBe('Senior');
      expect(result.yearsOfExperience).toBe(5);
      expect(result.availability).toBe(true);
    });

    it('should throw error when no sheets exist', () => {
      const buffer = Buffer.from('mock excel data');
      const mockWorkbook = { SheetNames: [], Sheets: {} };

      mockXLSX.read.mockReturnValue(mockWorkbook as any);

      expect(() => service.parseExcelFile(buffer)).toThrow(
        new BadRequestException('Excel file must contain at least one sheet')
      );
    });

    it('should throw error for invalid seniority', () => {
      const buffer = Buffer.from('mock excel data');
      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: { Sheet1: {} },
      };

      const mockData = [
        ['Seniority', 'Years', 'Availability'],
        ['Invalid', 5, true],
      ];

      mockXLSX.read.mockReturnValue(mockWorkbook as any);
      (mockXLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);

      expect(() => service.parseExcelFile(buffer)).toThrow(
        new BadRequestException('Seniority must be "Junior" or "Senior"')
      );
    });
  });
});