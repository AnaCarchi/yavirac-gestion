import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { Student } from '../../../core/models';

@Component({
  selector: 'app-my-students',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="my-students">
      <div class="header">
        <h1>👥 Mis Estudiantes</h1>
        <p>Estudiantes bajo tu supervisión</p>
      </div>

      <div class="students-grid" *ngIf="!loading && students.length > 0">
        <div class="student-card" *ngFor="let student of students">
          <div class="student-header">
            <div class="student-avatar">
              {{ getInitials(student.person?.name, student.person?.lastname) }}
            </div>
            <div class="student-info">
              <div class="student-name">
                {{ student.person?.name }} {{ student.person?.lastname }}
              </div>
              <div class="student-meta">
                <span>✉️ {{ student.email }}</span>
                <span>🆔 {{ student.person?.dni }}</span>
              </div>
            </div>
          </div>

          <div class="student-details">
            <div class="detail-row">
              <span class="label">Carrera:</span>
              <span class="value">{{ student.career?.name || '-' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">SIGA:</span>
              <span class="badge" [class.active]="student.isMatriculatedInSIGA">
                {{ student.isMatriculatedInSIGA ? 'Matriculado' : 'No matriculado' }}
              </span>
            </div>
          </div>

          <div class="student-subjects">
            <span class="label">Asignaturas:</span>
            <div class="subjects-list">
              <span 
                *ngFor="let subject of student.enrolledSubjects" 
                class="subject-badge"
              >
                {{ getSubjectLabel(subject.type) }}
              </span>
            </div>
          </div>

          <div class="student-actions">
            <a 
              [routerLink]="['/tutor/evaluate', student.id]" 
              class="btn btn-primary btn-block"
            >
              📝 Evaluar Estudiante
            </a>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && students.length === 0">
        <div class="empty-icon">👥</div>
        <h3>No tienes estudiantes asignados</h3>
        <p>Contacta al coordinador de carrera</p>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando estudiantes...</p>
      </div>
    </div>
  `,
  styles: [`
:root {
  --blue: #2563eb;
  --blue-soft: #eff6ff;
  --orange: #f97316;
  --black: #111827;
  --gray: #6b7280;
  --border: #e5e7eb;
}

/* ================= CONTAINER ================= */
.my-students {
  max-width: 1400px;
  margin: 0 auto;
}

/* ================= HEADER ================= */
.header {
  margin-bottom: 32px;
}

.header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--black);
  margin-bottom: 6px;
}

.header p {
  color: var(--gray);
  font-size: 15px;
  margin: 0;
}

/* ================= GRID ================= */
.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

/* ================= CARD ================= */
.student-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  border-top: 4px solid var(--blue);
  transition: all 0.25s ease;
}

.student-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
}

/* ================= HEADER CARD ================= */
.student-header {
  display: flex;
  gap: 16px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.student-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blue), #1e40af);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
}

.student-info {
  flex: 1;
}

.student-name {
  font-size: 17px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 6px;
}

.student-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.student-meta span {
  font-size: 13px;
  color: var(--gray);
}

/* ================= DETAILS ================= */
.student-details {
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.detail-row .label {
  font-size: 13px;
  color: var(--gray);
  font-weight: 500;
}

.detail-row .value {
  font-size: 14px;
  font-weight: 600;
  color: var(--black);
}

/* ================= BADGES ================= */
.badge {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(249, 115, 22, 0.15);
  color: var(--orange);
}

.badge.active {
  background: rgba(37, 99, 235, 0.15);
  color: var(--blue);
}

/* ================= SUBJECTS ================= */
.student-subjects {
  margin-bottom: 20px;
}

.student-subjects .label {
  font-size: 13px;
  font-weight: 500;
  color: var(--gray);
  margin-bottom: 8px;
  display: block;
}

.subjects-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.subject-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: var(--blue-soft);
  color: var(--blue);
}

/* ================= ACTIONS ================= */
.student-actions .btn {
  width: 100%;
  background: linear-gradient(135deg, var(--blue), #1e40af);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
  display: block;
  text-align: center;
}

.student-actions .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(37, 99, 235, 0.4);
}

/* ================= EMPTY & LOADING ================= */
.empty-state,
.loading-spinner {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3,
.loading-spinner p {
  font-size: 18px;
  color: var(--black);
}

.empty-state p {
  color: var(--gray);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .students-grid {
    grid-template-columns: 1fr;
  }
}
`]

})
export class MyStudentsComponent implements OnInit {
  private studentService = inject(StudentService);

  students: Student[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadStudents();
  }

  private loadStudents(): void {
    this.loading = true;
    this.studentService.getMyStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.loading = false;
      }
    });
  }

  getInitials(name?: string, lastname?: string): string {
    const n = name?.charAt(0) || '';
    const l = lastname?.charAt(0) || '';
    return (n + l).toUpperCase() || 'U';
  }

  getSubjectLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'VINCULATION': 'Vinculación',
      'DUAL_INTERNSHIP': 'Dual',
      'PREPROFESSIONAL_INTERNSHIP': 'Preprofesional'
    };
    return labels[type] || type;
  }
}