// src/app/shared/components/sidebar/sidebar.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">{{ logoIcon }}</span>
          <span class="logo-text" *ngIf="!collapsed">{{ title }}</span>
        </div>
        <button class="toggle-btn" (click)="toggleSidebar()">
          <span>{{ collapsed ? '→' : '←' }}</span>
        </button>
      </div>

      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li *ngFor="let item of menuItems" class="nav-item">
            <a 
              [routerLink]="item.route" 
              routerLinkActive="active"
              class="nav-link"
              [title]="collapsed ? item.label : ''"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
            </a>

            <!-- Submenu (si existe) -->
            <ul class="submenu" *ngIf="item.children && !collapsed">
              <li *ngFor="let child of item.children" class="submenu-item">
                <a 
                  [routerLink]="child.route" 
                  routerLinkActive="active"
                  class="submenu-link"
                >
                  <span class="submenu-icon">{{ child.icon }}</span>
                  <span class="submenu-label">{{ child.label }}</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer" *ngIf="!collapsed">
        <div class="user-info">
          <div class="user-avatar">{{ userInitials }}</div>
          <div class="user-details">
            <div class="user-name">{{ userName }}</div>
            <div class="user-role">{{ userRole }}</div>
          </div>
        </div>
      </div>
    </aside>
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

/* ================= SIDEBAR ================= */
.sidebar {
  width: 260px;
  height: 100vh;
  background: white;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: sticky;
  top: 0;
}

/* ================= COLLAPSED ================= */
.sidebar.collapsed {
  width: 72px;
}

.sidebar.collapsed .logo-text,
.sidebar.collapsed .nav-label,
.sidebar.collapsed .submenu,
.sidebar.collapsed .sidebar-footer {
  display: none;
}

.sidebar.collapsed .nav-link {
  justify-content: center;
}

/* ================= HEADER ================= */
.sidebar-header {
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 28px;
  color: var(--blue);
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--black);
}

/* Toggle */
.toggle-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  background: var(--blue-soft);
  color: var(--blue);
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: var(--blue);
  color: white;
}

/* ================= NAV ================= */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 12px 0;
}

/* Scrollbar */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

/* ================= MENU ================= */
.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 20px;
  color: var(--gray);
  text-decoration: none;
  font-size: 14px;
  border-radius: 0 20px 20px 0;
  transition: all 0.2s ease;
}

/* Hover */
.nav-link:hover {
  background: var(--blue-soft);
  color: var(--blue);
}

/* Active */
.nav-link.active {
  background: var(--blue-soft);
  color: var(--blue);
  font-weight: 600;
  border-left: 4px solid var(--orange);
}

/* Icon */
.nav-icon {
  font-size: 20px;
  min-width: 20px;
  text-align: center;
}

/* ================= SUBMENU ================= */
.submenu {
  list-style: none;
  padding: 6px 0 8px 0;
  margin: 0;
}

.submenu-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px 10px 52px;
  font-size: 13px;
  color: var(--gray);
  text-decoration: none;
  transition: all 0.2s;
}

.submenu-link:hover {
  color: var(--blue);
  background: #f8fafc;
}

.submenu-link.active {
  color: var(--blue);
  font-weight: 500;
}

.submenu-icon {
  font-size: 16px;
}

/* ================= FOOTER ================= */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 42px;
  height: 42px;
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
  font-weight: 600;
  color: var(--black);
}

.user-role {
  font-size: 12px;
  color: var(--gray);
}

/* ================= MOBILE ================= */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    box-shadow: 4px 0 12px rgba(0,0,0,0.15);
  }

  .sidebar.collapsed {
    transform: translateX(-100%);
  }
}
`]
})
export class SidebarComponent {
  @Input() title: string = 'Sistema Yavirac';
  @Input() logoIcon: string = '🎓';
  @Input() menuItems: MenuItem[] = [];
  @Input() userName: string = 'Usuario';
  @Input() userRole: string = 'Rol';
  @Input() userInitials: string = 'U';

  collapsed = false;

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }
}