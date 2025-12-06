import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { StudentService } from '../../../core/services/student.service';
import { Student } from '../../../core/models';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="student-dashboard">
      <div class="welcome-section">
        <h1>¡Bienvenido, {{ studentName }}! 👋</h1>
        <p>Gestiona tus asignaturas y documentos</p>
      </div>

      <!-- Información del Estudiante -->
      <div class="info-card" *ngIf="student">
        <div class="info-header">
          <div class="student-avatar-large">
            {{ getInitials(student.person?.name, student.person?.lastname) }}
          </div>
          <div class="student-details">
            <h2>{{ student.person?.name }} {{ student.person?.lastname }}</h2>
            <div class="student-meta">
              <span>🆔 {{ student.person?.dni }}</span>
              <span>✉️ {{ student.email }}</span>
              <span>🎓 {{ student.career?.name || 'Sin carrera' }}</span>
            </div>
            <div class="status-badges">
              <span class="badge" [class.active]="student.isMatriculatedInSIGA">
                {{ student.isMatriculatedInSIGA ? '✓ Matriculado SIGA' : '✗ No matriculado SIGA' }}
              </span>
              <span class="badge" [class.active]="student.tutor">
                {{ student.tutor ? '✓ Tutor asignado' : '⏳ Sin tutor' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mis Asignaturas -->
      <div class="section-card">
        <h2>📚 Mis Asignaturas</h2>
        <p class="section-description">Accede a tus asignaturas activas</p>

        <div class="subjects-grid" *ngIf="student?.enrolledSubjects && student.enrolledSubjects!.length > 0">
          <div 
            *ngFor="let subject of student?.enrolledSubjects" 
            class="subject-card"
            [class.vinculation]="subject.type === 'VINCULATION'"
            [class.dual]="subject.type === 'DUAL_INTERNSHIP'"
            [class.prepro]="subject.type === 'PREPROFESSIONAL_INTERNSHIP'"
          >
            <div class="subject-icon">
              {{ getSubjectIcon(subject.type) }}
            </div>
            <div class="subject-info">
              <h3>{{ getSubjectName(subject.type) }}</h3>
              <p>{{ getSubjectDescription(subject.type) }}</p>
              <div class="subject-meta">
                <span *ngIf="subject.enterprise">🏢 {{ subject.enterprise.name }}</span>
                <span class="status-badge" [class.active]="subject.status === 'EnCurso'">
                  {{ subject.status }}
                </span>
              </div>
            </div>
            <a [routerLink]="getSubjectRoute(subject.type)" class="btn btn-primary btn-block">
              Acceder →
            </a>
          </div>
        </div>

        <div class="empty-state" *ngIf="!student?.enrolledSubjects || student.enrolledSubjects!.length === 0">
          <div class="empty-icon">📚</div>
          <p>No tienes asignaturas activas</p>
          <p class="empty-hint">Contacta a tu coordinador de carrera</p>
        </div>
      </div>

      <!-- Información del Tutor -->
      <div class="section-card" *ngIf="student?.tutor">
        <h2>👔 Mi Tutor Empresarial</h2>
        
        <div class="tutor-info-card">
          <div class="tutor-avatar">
            {{ getInitials(student?.tutor?.person?.name, student?.tutor?.person?.lastname) }}
          </div>
          <div class="tutor-details">
            <h3>{{ student?.tutor?.person?.name }} {{ student?.tutor?.person?.lastname }}</h3>
            <div class="tutor-contact">
              <span>✉️ {{ student?.tutor?.email }}</span>
              <span *ngIf="student?.tutor?.person?.phonenumber">
                📞 {{ student?.tutor?.person?.phonenumber }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones Rápidas -->
      <div class="section-card">
        <h2>⚡ Acciones Rápidas</h2>
        
        <div class="actions-grid">
          <a routerLink="/student/documents" class="action-card">
            <div class="action-icon">📄</div>
            <div class="action-title">Mis Documentos</div>
            <div class="action-description">Ver documentos generados</div>
          </a>

          <a routerLink="/student/subjects/vinculation" class="action-card" *ngIf="hasSubjectType('VINCULATION')">
            <div class="action-icon">🤝</div>
            <div class="action-title">Vinculación</div>
            <div class="action-description">160 horas comunitarias</div>
          </a>

          <a routerLink="/student/subjects/dual-internship" class="action-card" *ngIf="hasSubjectType('DUAL_INTERNSHIP')">
            <div class="action-icon">🎓</div>
            <div class="action-title">Prácticas Dual</div>
            <div class="action-description">Prácticas formativas</div>
          </a>

          <a routerLink="/student/subjects/preprofessional-internship" class="action-card" *ngIf="hasSubjectType('PREPROFESSIONAL_INTERNSHIP')">
            <div class="action-icon">💼</div>
            <div class="action-title">Prácticas Preprofesionales</div>
            <div class="action-description">Prácticas complementarias</div>
          </a>
        </div>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando información...</p>
      </div>
    </div>
  `,
  styles: [`
    .student-dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      margin-bottom: 32px;

      h1 {
        font-size: 32px;
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

    .info-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .info-header {
        display: flex;
        gap: 24px;
        align-items: center;

        .student-avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 32px;
          flex-shrink: 0;
        }

        .student-details {
          flex: 1;

          h2 {
            font-size: 24px;
            color: #1f2937;
            font-weight: 700;
            margin-bottom: 12px;
          }

          .student-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            margin-bottom: 12px;

            span {
              font-size: 14px;
              color: #6b7280;
            }
          }

          .status-badges {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;

            .badge {
              padding: 6px 12px;
              background: #fee2e2;
              color: #991b1b;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;

              &.active {
                background: #d1fae5;
                color: #065f46;
              }
            }
          }
        }
      }
    }

    .section-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      h2 {
        font-size: 20px;
        color: #1f2937;
        font-weight: 600;
        margin-bottom: 8px;
      }

      .section-description {
        color: #6b7280;
        font-size: 14px;
        margin-bottom: 24px;
      }
    }

    .subjects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .subject-card {
      border: 2px solid;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      &.vinculation {
        border-color: #fbbf24;
        background: #fffbeb;

        .subject-icon {
          color: #92400e;
        }
      }

      &.dual {
        border-color: #3b82f6;
        background: #eff6ff;

        .subject-icon {
          color: #1e40af;
        }
      }

      &.prepro {
        border-color: #10b981;
        background: #ecfdf5;

        .subject-icon {
          color: #065f46;
        }
      }

      .subject-icon {
        font-size: 48px;
        text-align: center;
      }

      .subject-info {
        flex: 1;

        h3 {
          font-size: 18px;
          color: #1f2937;
          font-weight: 600;
          margin-bottom: 8px;
        }

        p {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 12px;
          line-height: 1.5;
        }

        .subject-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;

          span {
            font-size: 13px;
            color: #6b7280;
          }

          .status-badge {
            display: inline-block;
            width: fit-content;
            padding: 4px 10px;
            background: #fee2e2;
            color: #991b1b;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 600;

            &.active {
              background: #d1fae5;
              color: #065f46;
            }
          }
        }
      }
    }

    .tutor-info-card {
      display: flex;
      gap: 20px;
      align-items: center;
      padding: 20px;
      background: #f9fafb;
      border-radius: 12px;
      border: 1.5px solid #e5e7eb;

      .tutor-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 20px;
        flex-shrink: 0;
      }

      .tutor-details {
        h3 {
          font-size: 18px;
          color: #1f2937;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .tutor-contact {
          display: flex;
          flex-direction: column;
          gap: 4px;

          span {
            font-size: 14px;
            color: #6b7280;
          }
        }
      }
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .action-card {
      padding: 24px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      text-decoration: none;
      transition: all 0.2s;
      text-align: center;

      &:hover {
        border-color: #10b981;
        background: #f0fdf4;
        transform: translateY(-2px);
      }

      .action-icon {
        font-size: 40px;
        margin-bottom: 12px;
      }

      .action-title {
        font-size: 15px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 6px;
      }

      .action-description {
        font-size: 13px;
        color: #6b7280;
      }
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;

      .empty-icon {
        font-size: 64px;
        margin-bottom: 16px;
      }

      p {
        color: #6b7280;
        margin-bottom: 8px;
      }

      .empty-hint {
        font-size: 13px;
        color: #9ca3af;
      }
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80px;

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top-color: #10b981;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-bottom: 16px;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .info-header {
        flex-direction: column;
        text-align: center;

        .student-meta {
          justify-content: center;
        }

        .status-badges {
          justify-content: center;
        }
      }

      .subjects-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private studentService = inject(StudentService);

  student?: Student;
  loading = true;
  studentName = 'Estudiante';

  ngOnInit(): void {
    this.loadStudentData();
  }

  private loadStudentData(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      this.studentService.getById(currentUser.id).subscribe({
        next: (student) => {
          this.student = student;
          this.studentName = student.person?.name || 'Estudiante';
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading student:', error);
          this.loading = false;
        }
      });
    }
  }

  getInitials(name?: string, lastname?: string): string {
    const n = name?.charAt(0) || '';
    const l = lastname?.charAt(0) || '';
    return (n + l).toUpperCase() || 'E';
  }

  getSubjectIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'VINCULATION': '🤝',
      'DUAL_INTERNSHIP': '🎓',
      'PREPROFESSIONAL_INTERNSHIP': '💼'
    };
    return icons[type] || '📚';
  }

  getSubjectName(type: string): string {
    const names: { [key: string]: string } = {
      'VINCULATION': 'Vinculación con la Comunidad',
      'DUAL_INTERNSHIP': 'Prácticas de Formación Dual',
      'PREPROFESSIONAL_INTERNSHIP': 'Prácticas Preprofesionales'
    };
    return names[type] || type;
  }

  getSubjectDescription(type: string): string {
    const descriptions: { [key: string]: string } = {
      'VINCULATION': '160 horas de servicio comunitario',
      'DUAL_INTERNSHIP': 'Prácticas curriculares obligatorias',
      'PREPROFESSIONAL_INTERNSHIP': 'Prácticas complementarias'
    };
    return descriptions[type] || '';
  }

  getSubjectRoute(type: string): string {
    const routes: { [key: string]: string } = {
      'VINCULATION': '/student/subjects/vinculation',
      'DUAL_INTERNSHIP': '/student/subjects/dual-internship',
      'PREPROFESSIONAL_INTERNSHIP': '/student/subjects/preprofessional-internship'
    };
    return routes[type] || '/student/dashboard';
  }

  hasSubjectType(type: string): boolean {
    return this.student?.enrolledSubjects?.some(s => s.type === type) || false;
  }
}