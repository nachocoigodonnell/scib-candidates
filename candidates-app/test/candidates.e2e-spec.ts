import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as XLSX from 'xlsx';

describe('Candidates (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /candidates', () => {
    it('should return empty array initially', () => {
      return request(app.getHttpServer())
        .get('/candidates')
        .expect(200)
        .expect([]);
    });
  });

  describe('POST /candidates', () => {
    it('should create a candidate with valid data', async () => {
      // Create a mock Excel file
      const workbook = XLSX.utils.book_new();
      const worksheetData = [
        ['Seniority', 'Years', 'Availability'],
        ['Senior', 5, true]
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      const response = await request(app.getHttpServer())
        .post('/candidates')
        .field('firstName', 'John')
        .field('lastName', 'Doe')
        .attach('excelFile', excelBuffer, 'test.xlsx')
        .expect(201);

      expect(response.body).toMatchObject({
        firstName: 'John',
        lastName: 'Doe',
        seniority: 'Senior',
        yearsOfExperience: 5,
        availability: true,
      });

      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    it('should return 400 when Excel file is missing', () => {
      return request(app.getHttpServer())
        .post('/candidates')
        .field('firstName', 'John')
        .field('lastName', 'Doe')
        .expect(400);
    });

    it('should return 400 when firstName is missing', async () => {
      const workbook = XLSX.utils.book_new();
      const worksheetData = [['Seniority', 'Years', 'Availability'], ['Junior', 2, false]];
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return request(app.getHttpServer())
        .post('/candidates')
        .field('lastName', 'Doe')
        .attach('excelFile', excelBuffer, 'test.xlsx')
        .expect(400);
    });

    it('should return 400 when Excel data is invalid', async () => {
      const workbook = XLSX.utils.book_new();
      const worksheetData = [
        ['Seniority', 'Years', 'Availability'],
        ['InvalidSeniority', 5, true]
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return request(app.getHttpServer())
        .post('/candidates')
        .field('firstName', 'John')
        .field('lastName', 'Doe')
        .attach('excelFile', excelBuffer, 'test.xlsx')
        .expect(400);
    });
  });

  describe('Integration: POST then GET', () => {
    it('should create candidate and retrieve it in list', async () => {
      // Create candidate
      const workbook = XLSX.utils.book_new();
      const worksheetData = [
        ['Seniority', 'Years', 'Availability'],
        ['Junior', 2, false]
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      const createResponse = await request(app.getHttpServer())
        .post('/candidates')
        .field('firstName', 'Jane')
        .field('lastName', 'Smith')
        .attach('excelFile', excelBuffer, 'test.xlsx')
        .expect(201);

      // Get all candidates
      const getResponse = await request(app.getHttpServer())
        .get('/candidates')
        .expect(200);

      expect(getResponse.body).toHaveLength(1);
      expect(getResponse.body[0]).toMatchObject({
        id: createResponse.body.id,
        firstName: 'Jane',
        lastName: 'Smith',
        seniority: 'Junior',
        yearsOfExperience: 2,
        availability: false,
      });
    });
  });
});