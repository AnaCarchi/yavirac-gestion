import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { EvaluationService } from '../../../core/services/evaluation.service';
import { Student, Evaluation } from '../../../core/models';

@Component({
  selector: 'app-tutor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="tutor-dashboard">
      <div class="dashboard-header">
        <div>
          <h1>👔 Dashboard del Tutor</h1>
          <p>Gestión de estudiantes y evaluaciones</p>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-label">Mis Estudiantes</div>
            <div class="stat-value">{{ students.length }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-label">Evaluados</div>
            <div class="stat-value">{{ evaluatedCount }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <div class="stat-label">Pendientes</div>
            <div class="stat-value">{{ students.length - evaluatedCount }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-label">Total Evaluaciones</div>
            <div class="stat-value">{{ evaluations.length }}</div>
          </div>
        </div>
      </div>

      <!-- Estudiantes Asignados -->
      <div class="section-card">
        <div class="section-header">
          <h2>👥 Mis Estudiantes</h2>
          <a routerLink="/tutor/my-students" class="btn btn-outline btn-sm">
            Ver Todos →
          </a>
        </div>

        <div class="students-grid" *ngIf="students.length > 0">
          <div class="student-card" *ngFor="let student of students.slice(0, 4)">
            <div class="student-header">
              <div class="student-avatar">
                {{ getInitials(student.person?.name, student.person?.lastname) }}
              </div>
              <div class="student-info">
                <div class="student-name">
                  {{ student.person?.name }} {{ student.person?.lastname }}
                </div>
                <div class="student-email">{{ student.email }}</div>
              </div>
            </div>
            
            <div class="student-subjects">
              <span 
                *ngFor="let subject of student.enrolledSubjects" 
                class="subject-badge"
              >
                {{ getSubjectLabel(subject.type) }}
              </span>
            </div>

            <a 
              [routerLink]="['/tutor/evaluate', student.id]" 
              class="btn btn-primary btn-sm btn-block"
            >
              📝 Evaluar
            </a>
          </div>
        </div>

        <div class="empty-state" *ngIf="students.length === 0">
          <p>No tienes estudiantes asignados</p>
        </div>
      </div>

      <!-- Evaluaciones Recientes -->
      <div class="section-card">
        <div class="section-header">
          <h2>📋 Evaluaciones Recientes</h2>
          <a routerLink="/tutor/evaluations" class="btn btn-outline btn-sm">
            Ver Todas →
          </a>
        </div>

        <div class="evaluations-list" *ngIf="evaluations.length > 0">
          <div class="evaluation-item" *ngFor="let eval of evaluations.slice(0, 5)">
            <div class="eval-icon">📝</div>
            <div class="eval-content">
              <div class="eval-student">
                {{ eval.student.person?.name }} {{ eval.student.person?.lastname }}
              </div>
              <div class="eval-date">{{ eval.evaluationDate | date:'dd/MM/yyyy' }}</div>
            </div>
            <div class="eval-score" *ngIf="eval.score">
              <span class="score-value">{{ eval.score }}/10</span>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="evaluations.length === 0">
          <p>No hay evaluaciones registradas</p>
        </div>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando datos...</p>
      </div>
    </div>
  `,
  styles: [`
:root {
  --blue: #2563eb;
  --blue-dark: #1e40af;
  --blue-soft: #eff6ff;
  --orange: #f97316;
  --black: #111827;
  --gray: #6b7280;
  --border: #e5e7eb;
}

/* ================= CONTAINER ================= */
.tutor-dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

/* ================= HEADER ================= */
.dashboard-header {
  margin-bottom: 28px;
}

.dashboard-header h1 {
  font-size: 30px;
  font-weight: 700;
  color: var(--black);
  margin-bottom: 6px;
}

.dashboard-header p {
  font-size: 15px;
  color: var(--gray);
  margin: 0;
}

/* ================= STATS ================= */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  gap: 16px;
  align-items: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  transition: all 0.25s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 40px rgba(37,99,235,0.15);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--blue-soft);
  color: var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
}

.stat-content .stat-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--gray);
  margin-bottom: 6px;
}

.stat-content .stat-value {
  font-size: 34px;
  font-weight: 800;
  color: var(--black);
}

/* ================= SECTIONS ================= */
.section-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--black);
}

/* ================= STUDENTS ================= */
.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}

.student-card {
  border: 1.5px solid var(--border);
  border-radius: 14px;
  padding: 18px;
  transition: all 0.2s ease;
  background: white;
}

.student-card:hover {
  border-color: var(--blue);
  box-shadow: 0 8px 24px rgba(37,99,235,0.15);
}

.student-header {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}

.student-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.student-info .student-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 4px;
}

.student-info .student-email {
  font-size: 12px;
  color: var(--gray);
}

/* Subjects */
.student-subjects {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.subject-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(249,115,22,0.15);
  color: var(--orange);
}

/* ================= EVALUATIONS ================= */
.evaluations-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.evaluation-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border-radius: 12px;
  border: 1.5px solid var(--border);
  transition: all 0.2s ease;
}

.evaluation-item:hover {
  border-color: var(--blue);
  background: var(--blue-soft);
}

.eval-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: var(--blue-soft);
  color: var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.eval-content {
  flex: 1;
}

.eval-student {
  font-size: 14px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 4px;
}

.eval-date {
  font-size: 12px;
  color: var(--gray);
}

.eval-score .score-value {
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(249,115,22,0.15);
  color: var(--orange);
  font-size: 13px;
  font-weight: 700;
}

/* ================= STATES ================= */
.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--gray);
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .students-grid {
    grid-template-columns: 1fr;
  }
}
`]

})
export class TutorDashboardComponent implements OnInit {
  private studentService = inject(StudentService);
  private evaluationService = inject(EvaluationService);

  students: Student[] = [];
  evaluations: Evaluation[] = [];
  loading = true;
  evaluatedCount = 0;

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;

    this.studentService.getMyStudents().subscribe({
      next: (students) => {
        this.students = students;
      }
    });

    this.evaluationService.getByTutor().subscribe({
      next: (evaluations) => {
        this.evaluations = evaluations;
        this.evaluatedCount = new Set(evaluations.map(e => e.student.id)).size;
        this.loading = false;
      },
      error: () => {
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