import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { CandidateService, PaginationParams, PaginatedResponse } from '../../services/candidate.service';
import { Candidate } from '../../models/candidate.model';
import { CandidateFormComponent } from '../candidate-form/candidate-form.component';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './candidate-list.component.html',
  styleUrl: './candidate-list.component.scss'
})
export class CandidateListComponent implements OnInit {
  candidates: Candidate[] = [];
  displayedColumns: string[] = ['name', 'seniority', 'yearsOfExperience', 'availability', 'actions'];
  loading = true;

  // Pagination
  totalCandidates = 0;
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [10, 20, 50];

  // Search
  searchTerm = '';
  searchInput = '';

  // Sorting
  sortBy = 'createdAt';
  sortOrder: 'ASC' | 'DESC' = 'DESC';
  sortOptions = [
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'seniority', label: 'Seniority' },
    { value: 'yearsOfExperience', label: 'Experience' },
    { value: 'availability', label: 'Availability' },
    { value: 'createdAt', label: 'Date Added' }
  ];

  constructor(
    private candidateService: CandidateService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCandidates();
  }

  loadCandidates() {
    this.loading = true;
    
    const params: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm || undefined
    };

    this.candidateService.getCandidatesWithPagination(params).subscribe({
      next: (response: PaginatedResponse<Candidate>) => {
        this.candidates = response.data;
        this.totalCandidates = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading candidates:', error);
        this.loading = false;
      }
    });
  }

  openCreateCandidateDialog() {
    const isMobile = window.innerWidth <= 768;
    
    const dialogRef = this.dialog.open(CandidateFormComponent, {
      width: isMobile ? '95vw' : '90vw',
      maxWidth: isMobile ? '95vw' : '700px',
      minWidth: isMobile ? '300px' : '600px',
      maxHeight: '90vh',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'custom-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCandidates();
      }
    });
  }

  getFullName(candidate: Candidate): string {
    return `${candidate.firstName} ${candidate.lastName}`;
  }

  getInitials(candidate: Candidate): string {
    return `${candidate.firstName.charAt(0)}${candidate.lastName.charAt(0)}`.toUpperCase();
  }

  getAvailableCandidates(): number {
    return this.candidates.filter(c => c.availability).length;
  }

  getSeniorCandidates(): number {
    return this.candidates.filter(c => c.seniority === 'Senior').length;
  }

  downloadFile(candidate: Candidate): void {
    if (candidate.fileUrl) {
      this.candidateService.downloadFile(candidate.id);
    }
  }

  hasFile(candidate: Candidate): boolean {
    return !!candidate.fileUrl;
  }

  // Pagination methods
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadCandidates();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCandidates / this.pageSize);
  }

  // Search methods
  performSearch() {
    this.searchTerm = this.searchInput.trim();
    this.currentPage = 1;
    this.loadCandidates();
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchInput = '';
    this.currentPage = 1;
    this.loadCandidates();
  }

  // Sorting methods
  onSortChange() {
    this.currentPage = 1;
    this.loadCandidates();
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    this.onSortChange();
  }
}
