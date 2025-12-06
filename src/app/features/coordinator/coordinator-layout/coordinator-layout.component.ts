import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-coordinator-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="coordinator-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" fill="#3b82f6"/>
              <text x="50%" y="55%" text-anchor="middle" fill="white" font-size="20" font-weight="bold">Y</text>
            </svg>
            <span>Yavirac</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/coordinator/dashboard" routerLinkActive="active" class="nav-item">
            <span class="icon">📊</span>
            <span>Dashboard</span>
          </a>
          <a routerLink="/coordinator/students" routerLinkActive="active" class="nav-item">
            <span class="icon">👥</span>
            <span>Estudiantes</span>
          </a>
          <a routerLink="/coordinator/reports" routerLinkActive="active" class="nav-item">
            <span class="icon">📄</span>
            <span>Reportes</span>
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
        <header class="top-bar">
          <h2>Panel de Coordinador</h2>
          <div class="user-info">
            <span>Coordinador de Carrera</span>
          </div>
        </header>
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .coordinator-layout {
      display: flex;
      min-height: 100vh;
      background: #f3f4f6;
    }

    .sidebar {
      width: 260px;
      background: #1f2937;
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      left: 0;
      top: 0;
    }

    .sidebar-header {
      padding: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 20px;
      font-weight: 700;
    }

    .sidebar-nav {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 8px;
      color: #d1d5db;
      text-decoration: none;
      transition: all 0.2s;
      margin-bottom: 4px;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: white;
      }

      &.active {
        background: #3b82f6;
        color: white;
      }

      .icon {
        font-size: 20px;
      }
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-logout {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(239, 68, 68, 0.1);
      color: #fca5a5;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(239, 68, 68, 0.2);
      }
    }

    .main-content {
      flex: 1;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
    }

    .top-bar {
      background: white;
      padding: 20px 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        font-size: 24px;
        color: #1f2937;
        margin: 0;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #6b7280;
      font-size: 14px;
    }

    .content-area {
      flex: 1;
      padding: 32px;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 70px;
      }

      .logo span,
      .nav-item span:not(.icon),
      .btn-logout span:not(.icon) {
        display: none;
      }

      .main-content {
        margin-left: 70px;
      }
    }
  `]
})
export class CoordinatorLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
  }
}