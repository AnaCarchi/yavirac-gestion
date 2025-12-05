import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reports-container">
      <h2>Generar Reportes</h2>

      <div class="report-types">
        <div class="report-card" *ngFor="let report of reportTypes">
          <div class="report-icon">{{ report.icon }}</div>
          <h3>{{ report.title }}</h3>
          <p>{{ report.description }}</p>
          <button class="btn btn-primary" (click)="generateReport(report.type)">
            Generar Reporte
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      max-width: 1200px;
      margin: 0 auto;

      h2 {
        font-size: 28px;
        color: #1f2937;
        margin-bottom: 32px;
        font-weight: 700;
      }
    }

    .report-types {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .report-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }

      .report-icon {
        font-size: 64px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        color: #1f2937;
        margin-bottom: 12px;
      }

      p {
        color: #6b7280;
        font-size: 14px;
        margin-bottom: 24px;
      }
    }
  `]
})
export class ReportsComponent {
  reportTypes = [
    {
      type: 'students',
      icon: '👥',
      title: 'Reporte de Estudiantes',
      description: 'Lista completa de estudiantes con sus datos'
    },
    {
      type: 'vinculation',
      icon: '🤝',
      title: 'Vinculación',
      description: 'Reporte de estudiantes en vinculación'
    },
    {
      type: 'internships',
      icon: '💼',
      title: 'Prácticas',
      description: 'Reporte de estudiantes en prácticas'
    }
  ];

  generateReport(type: string): void {
    console.log('Generating report:', type);
    alert(`Generando reporte de ${type}...`);
  }
}