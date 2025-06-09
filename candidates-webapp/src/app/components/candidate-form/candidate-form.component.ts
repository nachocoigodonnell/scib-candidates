import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CandidateService } from '../../services/candidate.service';
import { CreateCandidateRequest } from '../../models/candidate.model';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './candidate-form.component.html',
  styleUrl: './candidate-form.component.scss'
})
export class CandidateFormComponent implements OnInit {
  candidateForm: FormGroup;
  selectedFile: File | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CandidateFormComponent>,
    private candidateService: CandidateService,
    private snackBar: MatSnackBar
  ) {
    this.candidateForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit() {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];

      if (allowedTypes.includes(file.type)) {
        this.selectedFile = file;
      } else {
        this.snackBar.open('Please select a valid Excel file (.xlsx or .xls)', 'Close', {
          duration: 3000
        });
        event.target.value = '';
      }
    }
  }

  onSubmit() {
    if (this.candidateForm.valid && this.selectedFile) {
      this.loading = true;

      const formData: CreateCandidateRequest = {
        firstName: this.candidateForm.value.firstName,
        lastName: this.candidateForm.value.lastName
      };

      this.candidateService.createCandidate(formData, this.selectedFile).subscribe({
        next: (candidate) => {
          this.snackBar.open(`Candidate ${candidate.firstName} created successfully!`, 'Close', {
            duration: 3000
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creating candidate:', error);
          const errorMessage = error.error?.message || 'Error creating candidate. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  private markFormGroupTouched() {
    Object.keys(this.candidateForm.controls).forEach(key => {
      const control = this.candidateForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.candidateForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least 2 characters`;
    }
    return '';
  }
}
