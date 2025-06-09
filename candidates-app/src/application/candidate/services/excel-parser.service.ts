import { CandidateDataFromExcelDto } from '../dtos/create-candidate.dto';

export interface ExcelParserService {
  parseExcelFile(buffer: Buffer): CandidateDataFromExcelDto;
}