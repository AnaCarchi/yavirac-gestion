import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-tutor-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="tutor-layout">
      <div class="enterprise-banner">
        <div class="banner-content">
          <div class="enterprise-logo"></div>
          <div class="enterprise-info">
            <h1>Empresa ABC S.A.</h1>
            <p>Portal del Tutor Empresarial</p>
          </div>
        </div>
      </div>

      <div class="content-wrapper">
        <aside class="sidebar">
          <nav class="sidebar-nav">
            <a routerLink="/tutor/dashboard" routerLinkActive="active" class="nav-item">
              <span class="icon">📊</span>
              <span>Dashboard</span>
            </a>
            <a routerLink="/tutor/my-students" routerLinkActive="active" class="nav-item">
              <span class="icon">👥</span>
              <span>Mis Estudiantes</span>
            </a>
            <a routerLink="/tutor/evaluations" routerLinkActive="active" class="nav-item">
              <span class="icon">📝</span>
              <span>Evaluaciones</span>
            </a>
          </nav>

          <div class="sidebar-footer">
            <button class="btn-logout" (click)="logout()">
              <span class="icon">🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .tutor-layout {
      min-height: 100vh;
      background: #f3f4f6;
    }

    .enterprise-banner {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      padding: 32px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      .banner-content {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 20px;

        .enterprise-logo {
          font-size: 64px;
          line-height: 1;
        }

        .enterprise-info {
          h1 {
            font-size: 32px;
            color: white;
            font-weight: 700;
            margin: 0 0 8px 0;
          }

          p {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            margin: 0;
          }
        }
      }
    }

    .content-wrapper {
      display: flex;
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px;
      gap: 32px;

      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    .sidebar {
      width: 260px;
      background: white;
      border-radius: 12px;
      padding: 24px;
      height: fit-content;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 32px;

      @media (max-width: 768px) {
        width: 100%;
        position: static;
      }

      .sidebar-nav {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 24px;

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          color: #6b7280;
          text-decoration: none;
          transition: all 0.2s;

          &:hover {
            background: #fef3c7;
            color: #92400e;
          }

          &.active {
            background: #fbbf24;
            color: white;
          }

          .icon {
            font-size: 20px;
          }
        }
      }

      .sidebar-footer {
        padding-top: 24px;
        border-top: 1px solid #e5e7eb;

        .btn-logout {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: rgba(239, 68, 68, 0.2);
          }
        }
      }
    }

    .main-content {
      flex: 1;
      min-width: 0;
    }
  `]
})
export class TutorLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
  }
}