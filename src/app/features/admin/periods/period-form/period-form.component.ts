import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PeriodService } from '../../../../core/services/period.service';
import { AcademicPeriod } from '../../../../core/models';

@Component({
  selector: 'app-period-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="period-form-container">
      <div class="form-header">
        <div>
          <a routerLink="/admin/periods" class="back-link">← Volver</a>
          <h1>{{ isEditMode ? 'Editar Periodo' : 'Nuevo Periodo' }}</h1>
          <p>{{ isEditMode ? 'Modificar información del periodo' : 'Crear un nuevo periodo académico' }}</p>
        </div>
      </div>

      <form [formGroup]="periodForm" (ngSubmit)="onSubmit()" class="period-form">
        <div class="form-card">
          <h2>Información del Periodo</h2>

          <div class="form-row">
            <div class="form-group full-width">
              <label for="name">Nombre del Periodo *</label>
              <input
                type="text"
                id="name"
                formControlName="name"
                class="form-control"
                placeholder="Ej: 2024-1, Octubre 2024 - Febrero 2025"
                [class.is-invalid]="name?.invalid && name?.touched"
              >
              <div class="invalid-feedback" *ngIf="name?.invalid && name?.touched">
                <span *ngIf="name?.errors?.['required']">El nombre es requerido</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group full-width">
              <label for="description">Descripción</label>
              <textarea
                id="description"
                formControlName="description"
                class="form-control"
                rows="3"
                placeholder="Descripción del periodo académico"
              ></textarea>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="startDate">Fecha de Inicio *</label>
              <input
                type="date"
                id="startDate"
                formControlName="startDate"
                class="form-control"
                [class.is-invalid]="startDate?.invalid && startDate?.touched"
              >
              <div class="invalid-feedback" *ngIf="startDate?.invalid && startDate?.touched">
                <span *ngIf="startDate?.errors?.['required']">La fecha de inicio es requerida</span>
              </div>
            </div>

            <div class="form-group">
              <label for="endDate">Fecha de Fin *</label>
              <input
                type="date"
                id="endDate"
                formControlName="endDate"
                class="form-control"
                [class.is-invalid]="endDate?.invalid && endDate?.touched"
              >
              <div class="invalid-feedback" *ngIf="endDate?.invalid && endDate?.touched">
                <span *ngIf="endDate?.errors?.['required']">La fecha de fin es requerida</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="status">Estado *</label>
              <select
                id="status"
                formControlName="status"
                class="form-control"
                [class.is-invalid]="status?.invalid && status?.touched"
              >
                <option value="">Seleccione un estado</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
              <div class="invalid-feedback" *ngIf="status?.invalid && status?.touched">
                <span *ngIf="status?.errors?.['required']">El estado es requerido</span>
              </div>
            </div>
          </div>
        </div>

        <div class="alert alert-danger" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <div class="form-actions">
          <button type="button" routerLink="/admin/periods" class="btn btn-secondary">
            Cancelar
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="periodForm.invalid || loading"
          >
            <span *ngIf="!loading">{{ isEditMode ? 'Actualizar' : 'Crear Periodo' }}</span>
            <span *ngIf="loading" class="loading-content">
              <span class="spinner-border spinner-border-sm"></span>
              {{ isEditMode ? 'Actualizando...' : 'Creando...' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .period-form-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .form-header {
      margin-bottom: 32px;

      .back-link {
        color: #667eea;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 12px;
        display: inline-block;

        &:hover {
          text-decoration: underline;
        }
      }

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

    .period-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      h2 {
        font-size: 20px;
        color: #1f2937;
        margin-bottom: 24px;
        font-weight: 600;
        padding-bottom: 16px;
        border-bottom: 2px solid #f3f4f6;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;

      &.full-width {
        grid-column: 1 / -1;
      }

      label {
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
      }

      .form-control {
        padding: 12px 16px;
        border: 1.5px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s;
        background-color: #f9fafb;
        font-family: inherit;

        &:focus {
          outline: none;
          border-color: #667eea;
          background-color: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        &.is-invalid {
          border-color: #ef4444;
          background-color: #fef2f2;
        }

        &::placeholder {
          color: #9ca3af;
        }
      }

      textarea.form-control {
        resize: vertical;
        min-height: 80px;
        font-family: inherit;
      }

      .invalid-feedback {
        color: #ef4444;
        font-size: 13px;
        margin-top: 6px;
      }
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 8px;
    }

    .loading-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column-reverse;

        button {
          width: 100%;
        }
      }
    }
  `]
})
export class PeriodFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private periodService = inject(PeriodService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  periodForm: FormGroup;
  loading = false;
  errorMessage = '';
  isEditMode = false;
  periodId?: number;

  constructor() {
    this.periodForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['Activo', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.periodId = +params['id'];
        this.loadPeriod(this.periodId);
      }
    });
  }

  private loadPeriod(id: number): void {
    this.loading = true;
    this.periodService.getById(id).subscribe({
      next: (period) => {
        this.periodForm.patchValue({
          name: period.name,
          description: period.description,
          startDate: this.formatDateForInput(period.startDate),
          endDate: this.formatDateForInput(period.endDate),
          status: period.status
        });
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar el periodo';
        this.loading = false;
        console.error('Error loading period:', error);
      }
    });
  }

  private formatDateForInput(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.periodForm.invalid) {
      this.markFormGroupTouched(this.periodForm);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const periodData: AcademicPeriod = {
      ...this.periodForm.value,
      id: this.periodId || 0
    };

    const request = this.isEditMode && this.periodId
      ? this.periodService.update(this.periodId, periodData)
      : this.periodService.create(periodData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin/periods']);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al guardar el periodo';
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get name() { return this.periodForm.get('name'); }
  get startDate() { return this.periodForm.get('startDate'); }
  get endDate() { return this.periodForm.get('endDate'); }
  get status() { return this.periodForm.get('status'); }
}