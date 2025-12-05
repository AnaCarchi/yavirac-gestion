import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PeriodService } from '../../../core/services/period.service';
import { CareerService } from '../../../core/services/career.service';
import { UserService } from '../../../core/services/user.service';

interface DashboardStats {
  totalPeriods: number;
  activePeriods: number;
  totalCareers: number;
  totalUsers: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Panel de Administración</h1>
        <p>Gestión del sistema Yavirac</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <div class="stat-label">Periodos Académicos</div>
            <div class="stat-value">{{ stats.totalPeriods }}</div>
            <div class="stat-sublabel">{{ stats.activePeriods }} activos</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🎓</div>
          <div class="stat-content">
            <div class="stat-label">Carreras</div>
            <div class="stat-value">{{ stats.totalCareers }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-label">Usuarios</div>
            <div class="stat-value">{{ stats.totalUsers }}</div>
          </div>
        </div>

        <div class="stat-card action-card">
          <div class="stat-icon">⚙️</div>
          <div class="stat-content">
            <div class="stat-label">Configuración</div>
            <a routerLink="/admin/users" class="stat-link">Gestionar →</a>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div class="actions-grid">
          <a routerLink="/admin/periods/new" class="action-btn">
            <span class="action-icon">➕</span>
            <span>Nuevo Periodo</span>
          </a>
          <a routerLink="/admin/careers/new" class="action-btn">
            <span class="action-icon">📚</span>
            <span>Nueva Carrera</span>
          </a>
          <a routerLink="/admin/users/new" class="action-btn">
            <span class="action-icon">👤</span>
            <span>Nuevo Usuario</span>
          </a>
          <a routerLink="/admin/periods" class="action-btn">
            <span class="action-icon">📋</span>
            <span>Ver Periodos</span>
          </a>
        </div>
      </div>

      <div class="recent-activity" *ngIf="!loading">
        <h2>Actividad Reciente</h2>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon">📅</div>
            <div class="activity-content">
              <div class="activity-title">Sistema iniciado</div>
              <div class="activity-time">Hoy</div>
            </div>
          </div>
        </div>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando datos...</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
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
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      gap: 20px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &.action-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;

        .stat-label {
          color: rgba(255, 255, 255, 0.9);
        }

        .stat-link {
          color: white;
          font-weight: 600;
        }
      }
    }

    .stat-icon {
      font-size: 40px;
      line-height: 1;
    }

    .stat-content {
      flex: 1;
    }

    .stat-label {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .stat-value {
      font-size: 36px;
      font-weight: 700;
      color: #1f2937;
      line-height: 1;
      margin-bottom: 4px;
    }

    .stat-sublabel {
      font-size: 13px;
      color: #9ca3af;
    }

    .stat-link {
      color: #667eea;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }

    .quick-actions {
      margin-bottom: 40px;

      h2 {
        font-size: 20px;
        color: #1f2937;
        margin-bottom: 20px;
        font-weight: 600;
      }
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .action-btn {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      transition: all 0.3s;
      color: #1f2937;

      &:hover {
        border-color: #667eea;
        background: #f9fafb;
        transform: translateY(-2px);
      }

      .action-icon {
        font-size: 32px;
      }

      span:last-child {
        font-size: 14px;
        font-weight: 500;
      }
    }

    .recent-activity {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      h2 {
        font-size: 20px;
        color: #1f2937;
        margin-bottom: 20px;
        font-weight: 600;
      }
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .activity-item {
      display: flex;
      gap: 16px;
      padding: 12px;
      border-radius: 8px;
      transition: background 0.2s;

      &:hover {
        background: #f9fafb;
      }
    }

    .activity-icon {
      font-size: 24px;
    }

    .activity-content {
      flex: 1;
    }

    .activity-title {
      font-size: 14px;
      color: #1f2937;
      margin-bottom: 4px;
      font-weight: 500;
    }

    .activity-time {
      font-size: 13px;
      color: #6b7280;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;

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

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private periodService = inject(PeriodService);
  private careerService = inject(CareerService);
  private userService = inject(UserService);

  loading = true;
  stats: DashboardStats = {
    totalPeriods: 0,
    activePeriods: 0,
    totalCareers: 0,
    totalUsers: 0
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;

    // Cargar periodos
    this.periodService.getAll().subscribe({
      next: (periods) => {
        this.stats.totalPeriods = periods.length;
        this.stats.activePeriods = periods.filter(p => p.status === 'Activo').length;
      },
      error: (error) => console.error('Error loading periods:', error)
    });

    // Cargar carreras
    this.careerService.getAll().subscribe({
      next: (careers) => {
        this.stats.totalCareers = careers.length;
      },
      error: (error) => console.error('Error loading careers:', error)
    });

    // Cargar usuarios
    this.userService.getAll().subscribe({
      next: (users) => {
        this.stats.totalUsers = users.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }
}