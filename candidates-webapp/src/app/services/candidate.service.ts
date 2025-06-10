import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate, CreateCandidateRequest } from '../models/candidate.model';
import { environment } from '../../environments/environment';

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private readonly apiUrl = `${environment.apiUrl}/candidates`;

  constructor(private http: HttpClient) {}

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl);
  }

  getCandidatesWithPagination(params: PaginationParams): Observable<PaginatedResponse<Candidate>> {
    let httpParams = new HttpParams();
    
    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.limit !== undefined) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }
    if (params.sortOrder) {
      httpParams = httpParams.set('sortOrder', params.sortOrder);
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<PaginatedResponse<Candidate>>(this.apiUrl, { params: httpParams });
  }

  createCandidate(candidateData: CreateCandidateRequest, excelFile: File): Observable<Candidate> {
    const formData = new FormData();
    formData.append('firstName', candidateData.firstName);
    formData.append('lastName', candidateData.lastName);
    formData.append('excelFile', excelFile);

    return this.http.post<Candidate>(this.apiUrl, formData);
  }

  downloadFile(candidateId: string): void {
    const downloadUrl = `${this.apiUrl}/${candidateId}/download-file`;
    
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = '';
    link.target = '_blank';
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}