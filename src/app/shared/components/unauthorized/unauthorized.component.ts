import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-card fade-in">

        <!-- ICON -->
        <div class="icon-wrapper">
          <svg width="96" height="96" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="4"/>
            <path d="M35 50 L65 50" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
          </svg>
        </div>

        <!-- TEXT -->
        <h1>403</h1>
        <h2>Acceso Denegado</h2>
        <p>
          No tienes permisos para acceder a esta sección del sistema.
          Si crees que es un error, contacta al administrador.
        </p>

        <!-- ACTION -->
        <button class="btn-primary" routerLink="/dashboard">
          ← Volver al Dashboard
        </button>

      </div>
    </div>
  `,
  styles: [`
    /* ================= CONTENEDOR ================= */
    .unauthorized-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        linear-gradient(135deg, rgba(30,58,138,0.05), rgba(249,115,22,0.08)),
        #f9fafb;
      padding: 20px;
    }

    /* ================= CARD ================= */
    .unauthorized-card {
      background: white;
      border-radius: 20px;
      padding: 48px 40px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
      border-top: 6px solid #f97316; /* naranja */
    }

    /* ================= ICONO ================= */
    .icon-wrapper {
      width: 96px;
      height: 96px;
      margin: 0 auto 24px;
      border-radius: 50%;
      background: rgba(249, 115, 22, 0.1);
      color: #f97316;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* ================= TEXTOS ================= */
    h1 {
      font-size: 48px;
      font-weight: 800;
      margin: 0;
      color: #1e3a8a; /* azul */
      letter-spacing: 1px;
    }

    h2 {
      font-size: 22px;
      margin: 8px 0 16px;
      color: #111827; /* negro */
      font-weight: 600;
    }

    p {
      font-size: 15px;
      color: #6b7280;
      margin-bottom: 32px;
      line-height: 1.6;
    }

    /* ================= BOTÓN ================= */
    .btn-primary {
      background: linear-gradient(135deg, #1e3a8a, #2563eb);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 30px rgba(37, 99, 235, 0.4);
    }

    /* ================= ANIMACIÓN ================= */
    .fade-in {
      animation: fadeIn 0.4s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ================= RESPONSIVE ================= */
    @media (max-width: 480px) {
      .unauthorized-card {
        padding: 32px 24px;
      }

      h1 {
        font-size: 40px;
      }
    }
  `]
})
export class UnauthorizedComponent {}
