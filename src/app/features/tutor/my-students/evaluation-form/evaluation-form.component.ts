import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { StudentService } from '../../../../core/services/student.service';
import { EvaluationService } from '../../../../core/services/evaluation.service';
import { Student, EvaluationTemplate, EvaluationField } from '../../../../core/models';

@Component({
  selector: 'app-evaluation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="evaluation-form-container">
      <div class="header">
        <a routerLink="/tutor/my-students" class="back-link">← Volver</a>
        <h1>📝 Evaluar Estudiante</h1>
      </div>

      <!-- Información del Estudiante -->
      <div class="student-info-card" *ngIf="student">
        <div class="student-header">
          <div class="student-avatar">
            {{ getInitials(student.person?.name, student.person?.lastname) }}
          </div>
          <div class="student-details">
            <h2>{{ student.person?.name }} {{ student.person?.lastname }}</h2>
            <div class="student-meta">
              <span>✉️ {{ student.email }}</span>
              <span>🎓 {{ student.career?.name || 'Sin carrera' }}</span>
            </div>
          </div>
        </div>

        <!-- Selección de Asignatura -->
        <div class="subject-selection" *ngIf="student?.enrolledSubjects && student.enrolledSubjects!.length > 1">
          <label>Selecciona la asignatura a evaluar:</label>
          <div class="subjects-grid">
            <button
              *ngFor="let subject of student.enrolledSubjects"
              type="button"
              class="subject-btn"
              [class.selected]="selectedSubjectType === subject.type"
              (click)="selectSubject(subject.type)"
            >
              <span class="subject-icon">{{ getSubjectIcon(subject.type) }}</span>
              <span class="subject-name">{{ getSubjectName(subject.type) }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Formulario de Evaluación -->
      <form [formGroup]="evaluationForm" (ngSubmit)="onSubmit()" *ngIf="template && selectedSubjectType">
        <div class="form-card">
          <div class="form-header">
            <h2>{{ template.name }}</h2>
            <span class="template-type">{{ getSubjectName(selectedSubjectType) }}</span>
          </div>

          <!-- Campos Dinámicos -->
          <div class="fields-container" formArrayName="fields">
            <div 
              *ngFor="let field of fieldsArray.controls; let i = index" 
              class="field-group"
              [formGroupName]="i"
            >
              <label [for]="'field-' + i">
                {{ template.fields[i].name }}
                <span class="required" *ngIf="template.fields[i].required">*</span>
              </label>

              <!-- Campo de Texto -->
              <input
                *ngIf="template.fields[i].type === 'text'"
                type="text"
                [id]="'field-' + i"
                formControlName="value"
                class="form-control"
                [class.is-invalid]="isFieldInvalid(i)"
              >

              <!-- Campo Numérico -->
              <input
                *ngIf="template.fields[i].type === 'number'"
                type="number"
                [id]="'field-' + i"
                formControlName="value"
                class="form-control"
                [class.is-invalid]="isFieldInvalid(i)"
                min="0"
                max="10"
                step="0.1"
              >

              <!-- Campo Select -->
              <select
                *ngIf="template.fields[i].type === 'select'"
                [id]="'field-' + i"
                formControlName="value"
                class="form-control"
                [class.is-invalid]="isFieldInvalid(i)"
              >
                <option value="">Seleccione una opción</option>
                <option *ngFor="let option of template.fields[i].options" [value]="option">
                  {{ option }}
                </option>
              </select>

              <!-- Campo Textarea -->
              <textarea
                *ngIf="template.fields[i].type === 'textarea'"
                [id]="'field-' + i"
                formControlName="value"
                class="form-control"
                rows="4"
                [class.is-invalid]="isFieldInvalid(i)"
              ></textarea>

              <div class="invalid-feedback" *ngIf="isFieldInvalid(i)">
                Este campo es requerido
              </div>
            </div>
          </div>

          <!-- Calificación General -->
          <div class="score-section">
            <label for="score">Calificación General (0-10) *</label>
            <input
              type="number"
              id="score"
              formControlName="score"
              class="form-control score-input"
              min="0"
              max="10"
              step="0.1"
              [class.is-invalid]="evaluationForm.get('score')?.invalid && evaluationForm.get('score')?.touched"
            >
            <div class="score-indicator" *ngIf="evaluationForm.get('score')?.value">
              <div class="score-bar">
                <div 
                  class="score-fill"
                  [style.width.%]="(evaluationForm.get('score')?.value / 10) * 100"
                  [class.excellent]="evaluationForm.get('score')?.value >= 9"
                  [class.good]="evaluationForm.get('score')?.value >= 7 && evaluationForm.get('score')?.value < 9"
                  [class.regular]="evaluationForm.get('score')?.value >= 5 && evaluationForm.get('score')?.value < 7"
                  [class.poor]="evaluationForm.get('score')?.value < 5"
                ></div>
              </div>
              <div class="score-label">{{ getScoreLabel(evaluationForm.get('score')?.value) }}</div>
            </div>
          </div>

          <!-- Comentarios -->
          <div class="comments-section">
            <label for="comments">Comentarios Adicionales</label>
            <textarea
              id="comments"
              formControlName="comments"
              class="form-control"
              rows="5"
              placeholder="Agrega observaciones, fortalezas o áreas de mejora..."
            ></textarea>
          </div>
        </div>

        <!-- Error Message -->
        <div class="alert alert-danger" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <!-- Success Message -->
        <div class="alert alert-success" *ngIf="successMessage">
          {{ successMessage }}
        </div>

        <!-- Acciones -->
        <div class="form-actions">
          <button type="button" routerLink="/tutor/my-students" class="btn btn-secondary">
            Cancelar
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="evaluationForm.invalid || submitting"
          >
            <span *ngIf="!submitting">💾 Guardar Evaluación</span>
            <span *ngIf="submitting" class="loading-content">
              <span class="spinner-border spinner-border-sm"></span>
              Guardando...
            </span>
          </button>
        </div>
      </form>

      <!-- Loading -->
      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando formulario...</p>
      </div>

      <!-- No Subject Selected -->
      <div class="empty-state" *ngIf="student?.enrolledSubjects && student.enrolledSubjects!.length > 0 && !selectedSubjectType">
        <div class="empty-icon">📝</div>
        <h3>Selecciona una asignatura</h3>
        <p>Elige la asignatura que deseas evaluar</p>
      </div>
    </div>
  `,
  styles: [`
    .evaluation-form-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;

      .back-link {
        color: #f59e0b;
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
        font-weight: 700;
        margin: 0;
      }
    }

    .student-info-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .student-header {
        display: flex;
        gap: 20px;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 2px solid #f3f4f6;

        .student-avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 28px;
          flex-shrink: 0;
        }

        .student-details {
          flex: 1;

          h2 {
            font-size: 24px;
            color: #1f2937;
            font-weight: 700;
            margin-bottom: 8px;
          }

          .student-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;

            span {
              font-size: 14px;
              color: #6b7280;
            }
          }
        }
      }

      .subject-selection {
        label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
        }

        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;

          .subject-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            border: 2px solid #e5e7eb;
            background: white;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
            font-weight: 500;

            &:hover {
              border-color: #f59e0b;
              background: #fffbeb;
            }

            &.selected {
              border-color: #f59e0b;
              background: #fef3c7;
              color: #92400e;
            }

            .subject-icon {
              font-size: 24px;
            }
          }
        }
      }
    }

    .form-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .form-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 2px solid #f3f4f6;

        h2 {
          font-size: 20px;
          color: #1f2937;
          font-weight: 600;
          margin: 0;
        }

        .template-type {
          padding: 6px 14px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
        }
      }
    }

    .fields-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-bottom: 32px;

      .field-group {
        display: flex;
        flex-direction: column;

        label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;

          .required {
            color: #ef4444;
            margin-left: 4px;
          }
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
            border-color: #f59e0b;
            background-color: white;
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
          }

          &.is-invalid {
            border-color: #ef4444;
            background-color: #fef2f2;
          }
        }

        textarea.form-control {
          resize: vertical;
          min-height: 100px;
        }

        .invalid-feedback {
          color: #ef4444;
          font-size: 13px;
          margin-top: 6px;
        }
      }
    }

    .score-section {
      background: #f9fafb;
      padding: 24px;
      border-radius: 10px;
      margin-bottom: 24px;

      label {
        display: block;
        font-size: 15px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 12px;
      }

      .score-input {
        width: 150px;
        font-size: 18px;
        font-weight: 700;
        text-align: center;
        padding: 14px;
      }

      .score-indicator {
        margin-top: 16px;

        .score-bar {
          height: 12px;
          background: #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 8px;

          .score-fill {
            height: 100%;
            transition: all 0.3s;
            border-radius: 6px;

            &.excellent {
              background: linear-gradient(90deg, #10b981, #059669);
            }

            &.good {
              background: linear-gradient(90deg, #3b82f6, #2563eb);
            }

            &.regular {
              background: linear-gradient(90deg, #f59e0b, #d97706);
            }

            &.poor {
              background: linear-gradient(90deg, #ef4444, #dc2626);
            }
          }
        }

        .score-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
          text-align: center;
        }
      }
    }

    .comments-section {
      label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
      }

      textarea {
        width: 100%;
        padding: 12px 16px;
        border: 1.5px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
        resize: vertical;

        &:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }
      }
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .loading-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .alert {
      padding: 16px 20px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 14px;

      &.alert-danger {
        background: #fee2e2;
        color: #991b1b;
        border: 1px solid #fecaca;
      }

      &.alert-success {
        background: #d1fae5;
        color: #065f46;
        border: 1px solid #a7f3d0;
      }
    }

    .loading-spinner, .empty-state {
      text-align: center;
      padding: 80px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .empty-icon {
        font-size: 64px;
        margin-bottom: 20px;
      }

      h3 {
        font-size: 20px;
        color: #1f2937;
        margin-bottom: 8px;
      }

      p {
        color: #6b7280;
        margin: 0;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top-color: #f59e0b;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 16px;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .student-header {
        flex-direction: column;
        text-align: center;

        .student-meta {
          justify-content: center;
        }
      }

      .form-header {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 12px;
      }

      .subjects-grid {
        grid-template-columns: 1fr !important;
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
export class EvaluationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private evaluationService = inject(EvaluationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  evaluationForm: FormGroup;
  student?: Student;
  template?: EvaluationTemplate;
  selectedSubjectType?: string;
  loading = true;
  submitting = false;
  errorMessage = '';
  successMessage = '';
  studentId?: number;

  constructor() {
    this.evaluationForm = this.fb.group({
      fields: this.fb.array([]),
      score: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      comments: ['']
    });
  }

  get fieldsArray(): FormArray {
    return this.evaluationForm.get('fields') as FormArray;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['studentId']) {
        this.studentId = +params['studentId'];
        this.loadStudent();
      }
    });
  }

  private loadStudent(): void {
    this.loading = true;
    this.studentService.getById(this.studentId!).subscribe({
      next: (student) => {
        this.student = student;
        
        // Si solo tiene una asignatura, seleccionarla automáticamente
        if (student.enrolledSubjects && student.enrolledSubjects.length === 1) {
          this.selectSubject(student.enrolledSubjects[0].type);
        }
        
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar el estudiante';
        this.loading = false;
      }
    });
  }

  selectSubject(subjectType: string): void {
    this.selectedSubjectType = subjectType;
    this.loadTemplate(subjectType);
  }

  private loadTemplate(subjectType: string): void {
    this.evaluationService.getTemplateByType(subjectType).subscribe({
      next: (template) => {
        this.template = template;
        this.buildForm();
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar la plantilla de evaluación';
      }
    });
  }

  private buildForm(): void {
    this.fieldsArray.clear();
    
    this.template?.fields.forEach(field => {
      const validators = field.required ? [Validators.required] : [];
      this.fieldsArray.push(this.fb.group({
        fieldId: [field.id],
        value: ['', validators]
      }));
    });
  }

  onSubmit(): void {
    if (this.evaluationForm.invalid) {
      this.markFormGroupTouched(this.evaluationForm);
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const evaluationData = {
      studentId: this.studentId,
      subjectType: this.selectedSubjectType,
      templateId: this.template?.id,
      score: this.evaluationForm.get('score')?.value,
      comments: this.evaluationForm.get('comments')?.value,
      fields: this.fieldsArray.value
    };

    this.evaluationService.create(evaluationData).subscribe({
      next: () => {
        this.successMessage = 'Evaluación guardada exitosamente';
        setTimeout(() => {
          this.router.navigate(['/tutor/my-students']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al guardar la evaluación';
        this.submitting = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  isFieldInvalid(index: number): boolean {
    const field = this.fieldsArray.at(index);
    return !!(field.get('value')?.invalid && field.get('value')?.touched);
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
      'VINCULATION': 'Vinculación',
      'DUAL_INTERNSHIP': 'Prácticas Dual',
      'PREPROFESSIONAL_INTERNSHIP': 'Preprofesionales'
    };
    return names[type] || type;
  }

  getScoreLabel(score: number): string {
    if (score >= 9) return '🌟 Excelente';
    if (score >= 7) return '✅ Bueno';
    if (score >= 5) return '⚠️ Regular';
    return '❌ Insuficiente';
  }
}