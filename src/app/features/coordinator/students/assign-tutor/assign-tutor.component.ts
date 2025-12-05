import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../../core/services/student.service';
import { UserService } from '../../../../core/services/user.service';
import { Student, User } from '../../../../core/models';

@Component({
  selector: 'app-assign-tutor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="assign-tutor-container">
      <div class="header">
        <button class="btn btn-outline btn-sm" (click)="goBack()">
          ← Volver
        </button>
        <h2>Asignar Tutor Empresarial</h2>
        <p *ngIf="student">
          {{ student.person?.name }} {{ student.person?.lastname }}
        </p>
      </div>

      <form [formGroup]="tutorForm" (ngSubmit)="onSubmit()" class="tutor-form" *ngIf="student">
        <div class="form-group">
          <label for="tutor">Seleccionar Tutor *</label>
          <select 
            id="tutor" 
            formControlName="tutorId"
            class="form-control"
            [class.is-invalid]="isFieldInvalid('tutorId')"
          >
            <option value="">Seleccione un tutor...</option>
            <option *ngFor="let tutor of tutors" [value]="tutor.id">
              {{ tutor.email }} - {{ tutor.person?.name }} {{ tutor.person?.lastname }}
            </option>
          </select>
          <div class="invalid-feedback" *ngIf="isFieldInvalid('tutorId')">
            Debe seleccionar un tutor
          </div>
        </div>

        <div class="student-info">
          <h3>Información del Estudiante</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">{{ student.email }}</span>
            </div>
            <div class="info-item">
              <span class="label">Carrera:</span>
              <span class="value">{{ student.career?.name || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Estado SIGA:</span>
              <span class="value">
                <span class="badge" [class.badge-success]="student.isMatriculatedInSIGA">
                  {{ student.isMatriculatedInSIGA ? 'Matriculado' : 'No matriculado' }}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" (click)="goBack()">
            Cancelar
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="tutorForm.invalid || loading"
          >
            <span *ngIf="!loading">Asignar Tutor</span>
            <span *ngIf="loading">Asignando...</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .assign-tutor-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .header {
      margin-bottom: 32px;

      button {
        margin-bottom: 16px;
      }

      h2 {
        font-size: 24px;
        color: #1f2937;
        font-weight: 700;
        margin-bottom: 8px;
      }

      p {
        color: #6b7280;
        font-size: 16px;
        margin: 0;
      }
    }

    .tutor-form {
      .form-group {
        margin-bottom: 24px;

        label {
          display: block;
          margin-bottom: 8px;
          color: #374151;
          font-weight: 500;
          font-size: 14px;
        }

        .is-invalid {
          border-color: #ef4444;
        }

        .invalid-feedback {
          color: #ef4444;
          font-size: 13px;
          margin-top: 6px;
          display: block;
        }
      }

      .student-info {
        background: #f9fafb;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 24px;

        h3 {
          font-size: 16px;
          color: #1f2937;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;

          @media (max-width: 640px) {
            grid-template-columns: 1fr;
          }

          .info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .label {
              font-size: 12px;
              color: #6b7280;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }

            .value {
              font-size: 14px;
              color: #1f2937;
              font-weight: 500;
            }
          }
        }
      }

      .form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        padding-top: 24px;
        border-top: 1px solid #e5e7eb;
      }
    }

    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;

      &.badge-success {
        background: #d1fae5;
        color: #065f46;
      }
    }
  `]
})
export class AssignTutorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private userService = inject(UserService);

  student?: Student;
  tutors: User[] = [];
  tutorForm: FormGroup;
  loading = false;

  constructor() {
    this.tutorForm = this.fb.group({
      tutorId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const studentId = this.route.snapshot.paramMap.get('id');
    if (studentId) {
      this.loadStudent(+studentId);
      this.loadTutors();
    }
  }

  loadStudent(id: number): void {
    this.studentService.getById(id).subscribe({
      next: (student) => {
        this.student = student;
        if (student.tutor) {
          this.tutorForm.patchValue({
            tutorId: student.tutor.id
          });
        }
      },
      error: (error) => {
        console.error('Error loading student:', error);
        alert('Error al cargar el estudiante');
      }
    });
  }

  loadTutors(): void {
    this.userService.getTutors().subscribe({
      next: (tutors) => {
        this.tutors = tutors;
      },
      error: (error) => {
        console.error('Error loading tutors:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.tutorForm.invalid || !this.student) {
      return;
    }

    this.loading = true;
    const tutorId = this.tutorForm.value.tutorId;

    this.studentService.assignTutor(this.student.id, tutorId).subscribe({
      next: () => {
        alert('Tutor asignado correctamente');
        this.goBack();
      },
      error: (error) => {
        console.error('Error assigning tutor:', error);
        alert('Error al asignar el tutor');
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/coordinator/students']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.tutorForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}