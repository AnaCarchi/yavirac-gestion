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
:root {
  --blue: #2563eb;
  --blue-dark: #1e3a8a;
  --blue-soft: #eff6ff;
  --orange: #f97316;
  --black: #111827;
  --gray: #6b7280;
  --border: #e5e7eb;
}

/* ================= LAYOUT ================= */
.tutor-layout {
  min-height: 100vh;
  background: #f9fafb;
}

/* ================= BANNER ================= */
.enterprise-banner {
  background: linear-gradient(135deg, var(--blue-dark), var(--blue));
  padding: 28px 24px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.banner-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
}

.enterprise-logo {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  background: rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
}

.enterprise-info h1 {
  font-size: 26px;
  color: white;
  font-weight: 700;
  margin: 0;
}

.enterprise-info p {
  font-size: 14px;
  color: rgba(255,255,255,0.85);
  margin: 4px 0 0;
}

/* ================= CONTENT ================= */
.content-wrapper {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  gap: 32px;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }
}

/* ================= SIDEBAR ================= */
.sidebar {
  width: 260px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  position: sticky;
  top: 24px;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    position: static;
  }
}

/* ================= NAV ================= */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 24px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 12px;
  color: var(--gray);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
}

.nav-item .icon {
  font-size: 20px;
}

/* Hover */
.nav-item:hover {
  background: var(--blue-soft);
  color: var(--blue);
}

/* Active */
.nav-item.active {
  background: var(--blue);
  color: white;
  font-weight: 600;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

/* ================= FOOTER ================= */
.sidebar-footer {
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

/* Logout */
.btn-logout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(249, 115, 22, 0.12);
  color: var(--orange);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: var(--orange);
  color: white;
}

/* ================= MAIN ================= */
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