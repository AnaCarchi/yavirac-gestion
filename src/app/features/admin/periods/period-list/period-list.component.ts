import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PeriodService } from '../../../../core/services/period.service';
import { AcademicPeriod } from '../../../../core/models';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-period-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DateFormatPipe],
  template: `
    <div class="period-list">
      <div class="list-header">
        <div>
          <h1>Periodos Académicos</h1>
          <p>Gestión de periodos del sistema</p>
        </div>
        <a routerLink="/admin/periods/new" class="btn btn-primary">
          <span>➕</span>
          <span>Nuevo Periodo</span>
        </a>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando periodos...</p>
      </div>

      <div class="periods-grid" *ngIf="!loading && periods.length > 0">
        <div class="period-card" *ngFor="let period of periods">
          <div class="period-header">
            <h3>{{ period.name }}</h3>
            <span class="period-status" [class.active]="period.status === 'Activo'">
              {{ period.status }}
            </span>
          </div>

          <div class="period-body">
            <p class="period-description" *ngIf="period.description">
              {{ period.description }}
            </p>

            <div class="period-dates">
              <div class="date-item">
                <span class="date-label">Inicio:</span>
                <span class="date-value">{{ period.startDate | dateFormat }}</span>
              </div>
              <div class="date-item">
                <span class="date-label">Fin:</span>
                <span class="date-value">{{ period.endDate | dateFormat }}</span>
              </div>
            </div>

            <div class="period-stats" *ngIf="period.careers">
              <span class="stat-item">
                🎓 {{ period.careers.length }} carreras
              </span>
            </div>
          </div>

          <div class="period-actions">
            <a [routerLink]="['/admin/periods', period.id, 'careers']" class="btn btn-sm btn-outline">
              Ver Carreras
            </a>
            <a [routerLink]="['/admin/periods', period.id, 'edit']" class="btn btn-sm btn-outline">
              ✏️ Editar
            </a>
            <button class="btn btn-sm btn-danger" (click)="deletePeriod(period)">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && periods.length === 0">
        <div class="empty-icon">📅</div>
        <h3>No hay periodos académicos</h3>
        <p>Comienza creando el primer periodo académico</p>
        <a routerLink="/admin/periods/new" class="btn btn-primary">
          Crear Primer Periodo
        </a>
      </div>

      <div class="error-message" *ngIf="errorMessage">
        <span>⚠️</span>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  `,
  styles: [`
    .period-list {
      max-width: 1400px;
      margin: 0 auto;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 20px;

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

    .periods-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .period-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }
    }

    .period-header {
      padding: 24px 24px 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      border-bottom: 1px solid #f3f4f6;

      h3 {
        font-size: 20px;
        color: #1f2937;
        margin: 0;
        font-weight: 600;
        flex: 1;
      }

      .period-status {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        background: #f3f4f6;
        color: #6b7280;
        white-space: nowrap;

        &.active {
          background: #d1fae5;
          color: #065f46;
        }
      }
    }

    .period-body {
      padding: 20px 24px;
    }

    .period-description {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .period-dates {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 8px;
    }

    .date-item {
      display: flex;
      justify-content: space-between;
      font-size: 14px;

      .date-label {
        color: #6b7280;
        font-weight: 500;
      }

      .date-value {
        color: #1f2937;
        font-weight: 600;
      }
    }

    .period-stats {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;

      .stat-item {
        font-size: 14px;
        color: #6b7280;
      }
    }

    .period-actions {
      padding: 16px 24px;
      background: #f9fafb;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      border-top: 1px solid #e5e7eb;
    }

    .empty-state {
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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      background: white;
      border-radius: 12px;

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top-color: #667eea;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      p {
        margin-top: 16px;
        color: #6b7280;
        font-size: 14px;
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

    @media (max-width: 768px) {
      .list-header {
        flex-direction: column;
        align-items: stretch;

        .btn {
          width: 100%;
        }
      }

      .periods-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PeriodListComponent implements OnInit {
  private periodService = inject(PeriodService);

  periods: AcademicPeriod[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadPeriods();
  }

  private loadPeriods(): void {
    this.loading = true;
    this.errorMessage = '';

    this.periodService.getAll().subscribe({
      next: (periods) => {
        this.periods = periods;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los periodos';
        this.loading = false;
        console.error('Error loading periods:', error);
      }
    });
  }

  deletePeriod(period: AcademicPeriod): void {
    if (confirm(`¿Está seguro de eliminar el periodo "${period.name}"?`)) {
      this.periodService.delete(period.id).subscribe({
        next: () => {
          this.periods = this.periods.filter(p => p.id !== period.id);
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar el periodo';
          console.error('Error deleting period:', error);
        }
      });
    }
  }
}