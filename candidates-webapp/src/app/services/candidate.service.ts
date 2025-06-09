import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate, CreateCandidateRequest } from '../models/candidate.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private readonly apiUrl = `${environment.apiUrl}/candidates`;

  constructor(private http: HttpClient) {}

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl);
  }

  createCandidate(candidateData: CreateCandidateRequest, excelFile: File): Observable<Candidate> {
    const formData = new FormData();
    formData.append('firstName', candidateData.firstName);
    formData.append('lastName', candidateData.lastName);
    formData.append('excelFile', excelFile);

    return this.http.post<Candidate>(this.apiUrl, formData);
  }
}