import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';

import { CandidateService } from '../../services/candidate.service';
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
    MatToolbarModule
  ],
  templateUrl: './candidate-list.component.html',
  styleUrl: './candidate-list.component.scss'
})
export class CandidateListComponent implements OnInit {
  candidates: Candidate[] = [];
  displayedColumns: string[] = ['name', 'seniority', 'yearsOfExperience', 'availability', 'createdAt'];
  loading = true;

  constructor(
    private candidateService: CandidateService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCandidates();
  }

  loadCandidates() {
    this.loading = true;
    this.candidateService.getCandidates().subscribe({
      next: (candidates) => {
        this.candidates = candidates;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading candidates:', error);
        this.loading = false;
      }
    });
  }

  openCreateCandidateDialog() {
    const dialogRef = this.dialog.open(CandidateFormComponent, {
      width: '500px',
      disableClose: true
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
}
