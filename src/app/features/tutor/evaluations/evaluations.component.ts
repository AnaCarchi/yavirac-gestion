import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EvaluationService } from '../../../core/services/evaluation.service';
import { Evaluation } from '../../../core/models';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-evaluations',
  standalone: true,
  imports: [CommonModule, RouterLink, DateFormatPipe],
  template: `
    <div class="evaluations-container">
      <div class="header">
        <div>
          <h1>📋 Historial de Evaluaciones</h1>
          <p>Todas las evaluaciones realizadas</p>
        </div>
        <a routerLink="/tutor/my-students" class="btn btn-primary">
          ➕ Nueva Evaluación
        </a>
      </div>

      <!-- Filtros -->
      <div class="filters-card">
        <div class="filter-tabs">
          <button 
            class="tab-btn"
            [class.active]="selectedFilter === 'all'"
            (click)="filterEvaluations('all')"
          >
            Todas ({{ evaluations.length }})
          </button>
          <button 
            class="tab-btn"
            [class.active]="selectedFilter === 'vinculation'"
            (click)="filterEvaluations('vinculation')"
          >
            Vinculación
          </button>
          <button 
            class="tab-btn"
            [class.active]="selectedFilter === 'dual'"
            (click)="filterEvaluations('dual')"
          >
            Prácticas Dual
          </button>
          <button 
            class="tab-btn"
            [class.active]="selectedFilter === 'prepro'"
            (click)="filterEvaluations('prepro')"
          >
            Preprofesionales
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando evaluaciones...</p>
      </div>

      <!-- Lista de Evaluaciones -->
      <div class="evaluations-list" *ngIf="!loading && filteredEvaluations.length > 0">
        <div class="evaluation-card" *ngFor="let evaluation of filteredEvaluations">
          <div class="eval-header">
            <div class="student-info">
              <div class="student-avatar">
                {{ getInitials(evaluation.student.person?.name, evaluation.student.person?.lastname) }}
              </div>
              <div class="student-details">
                <h3>{{ evaluation.student.person?.name }} {{ evaluation.student.person?.lastname }}</h3>
                <p class="student-email">{{ evaluation.student.email }}</p>
              </div>
            </div>
            <div class="eval-meta">
              <span class="eval-date">
                📅 {{ evaluation.evaluationDate | dateFormat }}
              </span>
              <span 
                class="subject-badge"
                [class.vinculation]="evaluation.subjectType === 'VINCULATION'"
                [class.dual]="evaluation.subjectType === 'DUAL_INTERNSHIP'"
                [class.prepro]="evaluation.subjectType === 'PREPROFESSIONAL_INTERNSHIP'"
              >
                {{ getSubjectTypeLabel(evaluation.subjectType) }}
              </span>
            </div>
          </div>

          <div class="eval-body">
            <div class="eval-info-grid">
              <div class="info-item">
                <span class="label">Plantilla:</span>
                <span class="value">{{ evaluation.template.name }}</span>
              </div>
              <div class="info-item">
                <span class="label">Estado:</span>
                <span class="status-badge" [class.active]="evaluation.status === 'Aprobado'">
                  {{ evaluation.status }}
                </span>
              </div>
              <div class="info-item" *ngIf="evaluation.score">
                <span class="label">Calificación:</span>
                <span class="score-value">{{ evaluation.score }}/10</span>
              </div>
            </div>

            <div class="eval-comments" *ngIf="evaluation.comments">
              <h4>💬 Comentarios:</h4>
              <p>{{ evaluation.comments }}</p>
            </div>
          </div>

          <div class="eval-actions">
            <a 
              [routerLink]="['/tutor/evaluate', evaluation.student.id]" 
              class="btn btn-sm btn-outline"
            >
              👁️ Ver Detalle
            </a>
            <button class="btn btn-sm btn-outline" (click)="downloadEvaluation(evaluation.id)">
              📥 Descargar
            </button>
          </div>
        </div>
      </div>

      <!-- Estado Vacío -->
      <div class="empty-state" *ngIf="!loading && filteredEvaluations.length === 0">
        <div class="empty-icon">📋</div>
        <h3>{{ selectedFilter === 'all' ? 'No hay evaluaciones' : 'No hay evaluaciones de este tipo' }}</h3>
        <p>{{ selectedFilter === 'all' ? 'Aún no has realizado evaluaciones' : 'Cambia el filtro para ver otras evaluaciones' }}</p>
        <a routerLink="/tutor/my-students" class="btn btn-primary">
          Evaluar Estudiantes
        </a>
      </div>

      <!-- Error -->
      <div class="error-message" *ngIf="errorMessage">
        <span>⚠️</span>
        <span>{{ errorMessage }}</span>
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
.evaluations-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ================= HEADER ================= */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 28px;
}

.header h1 {
  font-size: 30px;
  font-weight: 700;
  color: var(--black);
  margin-bottom: 6px;
}

.header p {
  font-size: 15px;
  color: var(--gray);
  margin: 0;
}

/* ================= FILTERS ================= */
.filters-card {
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 24px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 10px 18px;
  border-radius: 999px;
  border: 1.5px solid var(--border);
  background: white;
  font-size: 14px;
  font-weight: 600;
  color: var(--gray);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  border-color: var(--blue);
  background: var(--blue-soft);
  color: var(--blue);
}

.tab-btn.active {
  background: var(--blue);
  color: white;
  border-color: var(--blue);
  box-shadow: 0 6px 16px rgba(37,99,235,0.35);
}

/* ================= LIST ================= */
.evaluations-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ================= CARD ================= */
.evaluation-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: all 0.25s ease;
}

.evaluation-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 40px rgba(37,99,235,0.15);
}

/* ================= HEADER CARD ================= */
.eval-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 24px;
  border-bottom: 1px solid var(--border);
}

.student-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.student-avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.student-details h3 {
  font-size: 17px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 4px;
}

.student-email {
  font-size: 13px;
  color: var(--gray);
}

/* ================= META ================= */
.eval-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.eval-date {
  font-size: 13px;
  color: var(--gray);
}

/* Subject badge */
.subject-badge {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.subject-badge.vinculation {
  background: rgba(249,115,22,0.15);
  color: var(--orange);
}

.subject-badge.dual {
  background: var(--blue-soft);
  color: var(--blue);
}

.subject-badge.prepro {
  background: #d1fae5;
  color: #065f46;
}

/* ================= BODY ================= */
.eval-body {
  padding: 24px;
}

.eval-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item .label {
  font-size: 12px;
  color: var(--gray);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.info-item .value {
  font-size: 15px;
  font-weight: 600;
  color: var(--black);
}

.status-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: #fee2e2;
  color: #991b1b;
  width: fit-content;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.score-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--orange);
}

/* ================= COMMENTS ================= */
.eval-comments {
  background: #f9fafb;
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid var(--blue);
}

.eval-comments h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 6px;
}

.eval-comments p {
  font-size: 14px;
  color: var(--gray);
  margin: 0;
  line-height: 1.6;
}

/* ================= ACTIONS ================= */
.eval-actions {
  padding: 16px 24px;
  background: #f9fafb;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 10px;
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

.empty-state h3 {
  font-size: 20px;
  color: var(--black);
}

.empty-state p {
  color: var(--gray);
  margin-bottom: 24px;
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

/* ================= ERROR ================= */
.error-message {
  margin-top: 20px;
  padding: 16px 20px;
  border-radius: 12px;
  background: #fee2e2;
  color: #991b1b;
  display: flex;
  gap: 12px;
  align-items: center;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
  }

  .eval-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .eval-meta {
    align-items: flex-start;
  }

  .eval-info-grid {
    grid-template-columns: 1fr;
  }

  .btn {
    width: 100%;
  }
}
`]

})
export class EvaluationsComponent implements OnInit {
  private evaluationService = inject(EvaluationService);

  evaluations: Evaluation[] = [];
  filteredEvaluations: Evaluation[] = [];
  loading = true;
  errorMessage = '';
  selectedFilter = 'all';

  ngOnInit(): void {
    this.loadEvaluations();
  }

  private loadEvaluations(): void {
    this.loading = true;
    this.evaluationService.getByTutor().subscribe({
      next: (evaluations) => {
        this.evaluations = evaluations;
        this.filteredEvaluations = evaluations;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las evaluaciones';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  filterEvaluations(filter: string): void {
    this.selectedFilter = filter;
    
    if (filter === 'all') {
      this.filteredEvaluations = this.evaluations;
    } else {
      const typeMap: { [key: string]: string } = {
        'vinculation': 'VINCULATION',
        'dual': 'DUAL_INTERNSHIP',
        'prepro': 'PREPROFESSIONAL_INTERNSHIP'
      };
      
      this.filteredEvaluations = this.evaluations.filter(
        e => e.subjectType === typeMap[filter]
      );
    }
  }

  getInitials(name?: string, lastname?: string): string {
    const n = name?.charAt(0) || '';
    const l = lastname?.charAt(0) || '';
    return (n + l).toUpperCase() || 'E';
  }

  getSubjectTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'VINCULATION': 'Vinculación',
      'DUAL_INTERNSHIP': 'Prácticas Dual',
      'PREPROFESSIONAL_INTERNSHIP': 'Preprofesionales'
    };
    return labels[type] || type;
  }

  downloadEvaluation(id: number): void {
    // TODO: Implementar descarga de evaluación
    console.log('Downloading evaluation:', id);
    alert('Función de descarga en desarrollo');
  }
}