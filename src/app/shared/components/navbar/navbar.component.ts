import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <nav class="navbar">
      <div class="navbar-left">
        <button class="menu-toggle" (click)="onMenuToggle()" *ngIf="showMenuToggle">
          <span class="icon">☰</span>
        </button>
        
        <div class="navbar-title" *ngIf="title">
          <h1>{{ title }}</h1>
        </div>

        <div class="breadcrumb" *ngIf="breadcrumbs && breadcrumbs.length > 0">
          <span *ngFor="let crumb of breadcrumbs; let last = last">
            <span class="breadcrumb-item" [class.active]="last">{{ crumb }}</span>
            <span class="separator" *ngIf="!last">›</span>
          </span>
        </div>
      </div>

      <div class="navbar-right">
        <!-- Barra de búsqueda (opcional) -->
        <div class="search-box" *ngIf="showSearch">
          <input 
            type="text" 
            placeholder="Buscar..."
            class="search-input"
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
          >
          <span class="search-icon">🔍</span>
        </div>

        <!-- Notificaciones -->
        <div class="notification-btn" (click)="toggleNotifications()" *ngIf="showNotifications">
          <span class="icon">🔔</span>
          <span class="badge" *ngIf="notificationCount > 0">{{ notificationCount }}</span>
        </div>

        <!-- Dropdown de notificaciones -->
        <div class="dropdown notifications-dropdown" *ngIf="notificationsOpen">
          <div class="dropdown-header">
            <h3>Notificaciones</h3>
            <span class="close-btn" (click)="toggleNotifications()">✕</span>
          </div>
          <div class="dropdown-body">
            <div class="notification-item" *ngFor="let notif of notifications">
              <div class="notif-icon">{{ notif.icon }}</div>
              <div class="notif-content">
                <div class="notif-title">{{ notif.title }}</div>
                <div class="notif-time">{{ notif.time }}</div>
              </div>
            </div>
            <div class="empty-notif" *ngIf="notifications.length === 0">
              No tienes notificaciones
            </div>
          </div>
        </div>

        <!-- Menú de usuario -->
        <div class="user-menu" (click)="toggleUserMenu()">
          <div class="user-avatar">
            {{ userInitials }}
          </div>
          <div class="user-info" *ngIf="showUserInfo">
            <div class="user-name">{{ userName }}</div>
            <div class="user-role">{{ userRole }}</div>
          </div>
          <span class="dropdown-arrow">▼</span>
        </div>

        <!-- Dropdown de usuario -->
        <div class="dropdown user-dropdown" *ngIf="userMenuOpen">
          <div class="dropdown-item" (click)="goToProfile()">
            <span class="item-icon">👤</span>
            <span>Mi Perfil</span>
          </div>
          <div class="dropdown-item" (click)="goToSettings()">
            <span class="item-icon">⚙️</span>
            <span>Configuración</span>
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item logout" (click)="logout()">
            <span class="item-icon">🚪</span>
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </div>

      <!-- Overlay para cerrar dropdowns -->
      <div class="overlay" *ngIf="userMenuOpen || notificationsOpen" (click)="closeDropdowns()"></div>
    </nav>
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

/* ================= NAVBAR ================= */
.navbar {
  height: 64px;
  background: white;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

/* ================= LEFT ================= */
.navbar-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.menu-toggle {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: var(--blue-soft);
  color: var(--blue);
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-toggle:hover {
  background: var(--blue);
  color: white;
}

.navbar-title h1 {
  font-size: 20px;
  font-weight: 600;
  color: var(--black);
}

/* ================= BREADCRUMB ================= */
.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--gray);
}

.breadcrumb-item.active {
  color: var(--black);
  font-weight: 500;
}

.separator {
  margin: 0 6px;
}

/* ================= RIGHT ================= */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* ================= SEARCH ================= */
.search-box {
  position: relative;
}

.search-input {
  width: 260px;
  padding: 8px 36px 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray);
}

/* ================= NOTIFICATIONS ================= */
.notification-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.notification-btn:hover {
  background: var(--blue-soft);
}

.notification-btn .icon {
  font-size: 20px;
}

.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: var(--orange);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 999px;
}

/* ================= USER MENU ================= */
.user-menu {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.user-menu:hover {
  background: #f9fafb;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blue), #1e40af);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.user-name {
  font-size: 14px;
  color: var(--black);
}

.user-role {
  font-size: 12px;
  color: var(--gray);
}

.dropdown-arrow {
  font-size: 10px;
  color: var(--gray);
}

/* ================= DROPDOWNS ================= */
.dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: white;
  border-radius: 14px;
  box-shadow: 0 20px 45px rgba(0,0,0,0.15);
  min-width: 260px;
  overflow: hidden;
  animation: fadeIn 0.2s ease;
}

.dropdown-header {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  font-weight: 600;
}

.dropdown-item {
  padding: 12px 18px;
  display: flex;
  gap: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: var(--blue-soft);
}

.dropdown-item.logout {
  color: var(--orange);
}

.dropdown-divider {
  height: 1px;
  background: var(--border);
}

/* ================= NOTIFICATION ITEM ================= */
.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px 18px;
  border-bottom: 1px solid #f1f5f9;
}

.notif-icon {
  font-size: 22px;
}

.notif-title {
  font-size: 14px;
  color: var(--black);
}

.notif-time {
  font-size: 12px;
  color: var(--gray);
}

/* ================= OVERLAY ================= */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 99;
}

/* ================= ANIMATION ================= */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .search-input {
    width: 180px;
  }

  .user-info {
    display: none;
  }
}
`]

})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  @Input() title?: string;
  @Input() breadcrumbs?: string[];
  @Input() userName: string = 'Usuario';
  @Input() userRole: string = 'Rol';
  @Input() userInitials: string = 'U';
  @Input() showMenuToggle: boolean = true;
  @Input() showSearch: boolean = false;
  @Input() showNotifications: boolean = true;
  @Input() showUserInfo: boolean = true;
  @Input() notificationCount: number = 0;
  @Input() notifications: any[] = [];

  @Output() menuToggle = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  userMenuOpen = false;
  notificationsOpen = false;
  searchQuery = '';

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  onSearch(): void {
    this.search.emit(this.searchQuery);
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
    if (this.userMenuOpen) {
      this.notificationsOpen = false;
    }
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
    if (this.notificationsOpen) {
      this.userMenuOpen = false;
    }
  }

  closeDropdowns(): void {
    this.userMenuOpen = false;
    this.notificationsOpen = false;
  }

  goToProfile(): void {
    this.closeDropdowns();
    this.router.navigate(['/profile']);
  }

  goToSettings(): void {
    this.closeDropdowns();
    this.router.navigate(['/settings']);
  }

  logout(): void {
    this.closeDropdowns();
    this.authService.logout();
  }
}