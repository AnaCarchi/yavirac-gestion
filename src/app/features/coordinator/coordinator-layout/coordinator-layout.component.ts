import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../../../core/services/student.service';
import { CareerService } from '../../../../core/services/career.service';
import { Student, StudentFilter, SubjectType, Career } from '../../../../core/models';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="student-list">
      <div class="list-header">
        <div>
          <h1>Gestión de Estudiantes</h1>
          <p>Estudiantes de tus carreras</p>
        </div>
      </div>

      <!-- Filtros -->
      <form [formGroup]="filterForm" class="filters-card">
        <h3>Filtros</h3>
        <div class="filters-grid">
          <div class="form-group">
            <label for="career">Carrera</label>
            <select id="career" formControlName="careerId" class="form-control">
              <option value="">Todas las carreras</option>
              <option *ngFor="let career of careers" [value]="career.id">
                {{ career.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="subjectType">Tipo de Formación</label>
            <select id="subjectType" formControlName="subjectType" class="form-control">
              <option value="">Todos los tipos</option>
              <option value="VINCULATION">Vinculación</option>
              <option value="DUAL_INTERNSHIP">Prácticas Formación Dual</option>
              <option value="PREPROFESSIONAL_INTERNSHIP">Prácticas Preprofesionales</option>
            </select>
          </div>

          <div class="form-group">
            <label for="status">Estado SIGA</label>
            <select id="status" formControlName="isMatriculatedInSIGA" class="form-control">
              <option value="">Todos</option>
              <option value="true">Matriculados</option>
              <option value="false">No Matriculados</option>
            </select>
          </div>

          <div class="form-group">
            <label for="search">Buscar</label>
            <input
              type="text"
              id="search"
              formControlName="searchTerm"
              class="form-control"
              placeholder="Nombre o email..."
            >
          </div>
        </div>

        <div class="filter-actions">
          <button type="button" class="btn btn-primary" (click)="applyFilters()">
            🔍 Buscar
          </button>
          <button type="button" class="btn btn-outline" (click)="resetFilters()">
            ↺ Limpiar Filtros
          </button>
        </div>
      </form>

      <!-- Loading -->
      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando estudiantes...</p>
      </div>

      <!-- Tabla de Estudiantes -->
      <div class="students-table-container" *ngIf="!loading && students.length > 0">
        <div class="table-header">
          <h3>Estudiantes ({{ students.length }})</h3>
          <div class="table-info">
            <span class="info-badge matriculated">
              ✓ {{ matriculatedCount }} Matriculados en SIGA
            </span>
          </div>
        </div>

        <table class="students-table">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Carrera</th>
              <th>Email</th>
              <th>Tipo de Formación</th>
              <th>Tutor Asignado</th>
              <th>SIGA</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let student of students" [class.not-matriculated]="!student.isMatriculatedInSIGA">
              <td>
                <div class="student-info">
                  <div class="student-avatar">
                    {{ getInitials(student.person?.name, student.person?.lastname) }}
                  </div>
                  <div class="student-details">
                    <div class="student-name">
                      {{ student.person?.name }} {{ student.person?.lastname }}
                    </div>
                    <div class="student-dni">{{ student.person?.dni }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="career-badge">{{ student.career?.name || 'Sin carrera' }}</span>
              </td>
              <td>{{ student.email }}</td>
              <td>
                <div class="subject-types">
                  <span 
                    *ngFor="let subject of student.enrolledSubjects" 
                    class="subject-badge"
                    [class.vinculation]="subject.type === 'VINCULATION'"
                    [class.dual]="subject.type === 'DUAL_INTERNSHIP'"
                    [class.prepro]="subject.type === 'PREPROFESSIONAL_INTERNSHIP'"
                  >
                    {{ getSubjectTypeLabel(subject.type) }}
                  </span>
                  <span *ngIf="!student.enrolledSubjects || student.enrolledSubjects.length === 0" class="no-subjects">
                    Sin asignaturas
                  </span>
                </div>
              </td>
              <td>
                <div class="tutor-info" *ngIf="student.tutor">
                  <span class="tutor-name">{{ student.tutor.person?.name }} {{ student.tutor.person?.lastname }}</span>
                </div>
                <span class="no-tutor" *ngIf="!student.tutor">Sin asignar</span>
              </td>
              <td>
                <span class="siga-status" [class.active]="student.isMatriculatedInSIGA">
                  {{ student.isMatriculatedInSIGA ? '✓ Sí' : '✗ No' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <a 
                    [routerLink]="['/coordinator/students', student.id, 'assign-tutor']" 
                    class="btn btn-sm btn-outline"
                    [class.disabled]="!student.isMatriculatedInSIGA"
                  >
                    Asignar Tutor
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Estado Vacío -->
      <div class="empty-state" *ngIf="!loading && students.length === 0">
        <div class="empty-icon"></div>
        <h3>No se encontraron estudiantes</h3>
        <p>No hay estudiantes que coincidan con los filtros seleccionados</p>
        <button class="btn btn-outline" (click)="resetFilters()">
          Limpiar Filtros
        </button>
      </div>

      <!-- Error Message -->
      <div class="error-message" *ngIf="errorMessage">
        <span></span>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  `,
  styles: [`
    .student-list {
      max-width: 1400px;
      margin: 0 auto;
    }

    .list-header {
      margin-bottom: 32px;

      h1 {
        font-size: 32px;
        color: #1f2937;
        margin-bottom: 8px;
        font-weight: 700;
      }

      p {
        color: #6b7280;
        font-size: 16px;
        margin: 0;
      }
    }

    .filters-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      h3 {
        font-size: 18px;
        color: #1f2937;
        margin-bottom: 20px;
        font-weight: 600;
      }
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;

      label {
        font-size: 13px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 6px;
      }
    }

    .filter-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .students-table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .table-header {
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: 18px;
        color: #1f2937;
        font-weight: 600;
        margin: 0;
      }
    }

    .table-info {
      display: flex;
      gap: 12px;
    }

    .info-badge {
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 500;

      &.matriculated {
        background: #d1fae5;
        color: #065f46;
      }
    }

    .students-table {
      width: 100%;
      border-collapse: collapse;

      thead {
        background: #f9fafb;

        th {
          padding: 12px 16px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      }

      tbody {
        tr {
          border-bottom: 1px solid #f3f4f6;
          transition: background 0.2s;

          &:hover {
            background: #f9fafb;
          }

          &.not-matriculated {
            opacity: 0.6;
            background: #fef2f2;
          }
        }

        td {
          padding: 16px;
          font-size: 14px;
          color: #1f2937;
        }
      }
    }

    .student-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .student-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      flex-shrink: 0;
    }

    .student-details {
      min-width: 0;
    }

    .student-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 2px;
    }

    .student-dni {
      font-size: 12px;
      color: #6b7280;
    }

    .career-badge {
      display: inline-block;
      padding: 4px 10px;
      background: #e0e7ff;
      color: #3730a3;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 500;
    }

    .subject-types {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .subject-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      width: fit-content;

      &.vinculation {
        background: #fef3c7;
        color: #92400e;
      }

      &.dual {
        background: #dbeafe;
        color: #1e40af;
      }

      &.prepro {
        background: #d1fae5;
        color: #065f46;
      }
    }

    .no-subjects {
      color: #9ca3af;
      font-size: 12px;
      font-style: italic;
    }

    .tutor-name {
      font-size: 13px;
      color: #374151;
    }

    .no-tutor {
      color: #9ca3af;
      font-size: 13px;
      font-style: italic;
    }

    .siga-status {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 600;
      background: #fee2e2;
      color: #991b1b;

      &.active {
        background: #d1fae5;
        color: #065f46;
      }
    }

    .action-buttons {
      display: flex;
      gap: 8px;

      .disabled {
        opacity: 0.5;
        pointer-events: none;
      }
    }

    .empty-state, .loading-spinner {
      text-align: center;
      padding: 80px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .empty-icon {
        font-size: 64px;
        margin-bottom: 20px;
      }

      h3 {
        font-size: 20px;
        color: #1f2937;
        margin-bottom: 8px;
      }

      p {
        color: #6b7280;
        margin-bottom: 24px;
      }
    }

    .loading-spinner {
      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top-color: #667eea;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 16px;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-message {
      background: #fee2e2;
      color: #991b1b;
      padding: 16px 20px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 20px;
      border: 1px solid #fecaca;
    }

    @media (max-width: 1200px) {
      .students-table-container {
        overflow-x: auto;
      }

      .students-table {
        min-width: 900px;
      }
    }

    @media (max-width: 768px) {
      .filters-grid {
        grid-template-columns: 1fr;
      }

      .filter-actions {
        flex-direction: column;

        button {
          width: 100%;
        }
      }
    }
  `]
})
export class StudentListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private careerService = inject(CareerService);

  filterForm: FormGroup;
  students: Student[] = [];
  careers: Career[] = [];
  loading = true;
  errorMessage = '';

  constructor() {
    this.filterForm = this.fb.group({
      careerId: [''],
      subjectType: [''],
      isMatriculatedInSIGA: [''],
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.loadCareers();
    this.loadStudents();
  }

  private loadCareers(): void {
    this.careerService.getByCoordinator().subscribe({
      next: (careers) => {
        this.careers = careers;
      },
      error: (error) => {
        console.error('Error loading careers:', error);
      }
    });
  }

  private loadStudents(filter?: StudentFilter): void {
    this.loading = true;
    this.errorMessage = '';

    this.studentService.getAll(filter).subscribe({
      next: (students) => {
        this.students = students;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los estudiantes';
        this.loading = false;
        console.error('Error loading students:', error);
      }
    });
  }

  applyFilters(): void {
    const filter: StudentFilter = {};
    const formValue = this.filterForm.value;

    if (formValue.careerId) filter.careerId = +formValue.careerId;
    if (formValue.subjectType) filter.subjectType = formValue.subjectType as SubjectType;
    if (formValue.isMatriculatedInSIGA !== '') filter.isMatriculatedInSIGA = formValue.isMatriculatedInSIGA === 'true';
    if (formValue.searchTerm) filter.searchTerm = formValue.searchTerm;

    this.loadStudents(filter);
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.loadStudents();
  }

  get matriculatedCount(): number {
    return this.students.filter(s => s.isMatriculatedInSIGA).length;
  }

  getInitials(name?: string, lastname?: string): string {
    const n = name?.charAt(0) || '';
    const l = lastname?.charAt(0) || '';
    return (n + l).toUpperCase() || 'U';
  }

  getSubjectTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'VINCULATION': 'Vinculación',
      'DUAL_INTERNSHIP': 'Dual',
      'PREPROFESSIONAL_INTERNSHIP': 'Preprofesional'
    };
    return labels[type] || type;
  }
}