import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { ExcelParserService } from '../../../application/candidate/services/excel-parser.service';
import { CandidateDataFromExcelDto } from '../../../application/candidate/dtos/create-candidate.dto';

@Injectable()
export class XlsxExcelParserService implements ExcelParserService {
  parseExcelFile(buffer: Buffer): CandidateDataFromExcelDto {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      
      if (!sheetName) {
        throw new BadRequestException('Excel file must contain at least one sheet');
      }

      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (data.length < 2) {
        throw new BadRequestException('Excel file must contain at least one data row');
      }

      const row = data[1] as any[];
      
      if (row.length < 3) {
        throw new BadRequestException('Excel row must contain 3 columns: Seniority, Years of Experience, Availability');
      }

      const seniority = this.parseSeniority(row[0]);
      const yearsOfExperience = this.parseYearsOfExperience(row[1]);
      const availability = this.parseAvailability(row[2]);

      return new CandidateDataFromExcelDto(seniority, yearsOfExperience, availability);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error parsing Excel file: ' + error.message);
    }
  }

  private parseSeniority(value: any): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('Seniority must be a string');
    }

    const normalizedValue = value.trim().toLowerCase();
    
    if (normalizedValue === 'junior' || normalizedValue === 'senior') {
      return value.trim();
    } else {
      throw new BadRequestException('Seniority must be "Junior" or "Senior"');
    }
  }

  private parseYearsOfExperience(value: any): number {
    const years = Number(value);
    
    if (isNaN(years) || years < 0) {
      throw new BadRequestException('Years of experience must be a non-negative number');
    }
    
    return years;
  }

  private parseAvailability(value: any): boolean {
    if (typeof value === 'boolean') {
      return value;
    }
    
    if (typeof value === 'string') {
      const normalizedValue = value.trim().toLowerCase();
      if (normalizedValue === 'true') {
        return true;
      } else if (normalizedValue === 'false') {
        return false;
      }
    }
    
    throw new BadRequestException('Availability must be true or false');
  }
}