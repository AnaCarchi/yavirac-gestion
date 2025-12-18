import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      role: ['', Validators.required],
      email: ['admin@yavirac.edu.ec', [Validators.required, Validators.email]],
      password: ['admin123', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const selectedRole = this.loginForm.get('role')?.value;
    
    // Simular un token falso para desarrollo
    localStorage.setItem('token', 'fake-token-for-development');
    
    // Esperar un momento para simular la carga
    setTimeout(() => {
      this.loading = false;
      // Redirigir según el rol seleccionado
      this.redirectByRole(selectedRole);
    }, 500);

    /* 
    // DESCOMENTAR ESTO CUANDO TENGAS EL BACKEND FUNCIONANDO
    
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.status === 200 && response.data) {
          const selectedRole = this.loginForm.get('role')?.value;
          this.redirectByRole(selectedRole);
        } else {
          this.errorMessage = response.message || 'Error al iniciar sesión';
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al conectar con el servidor';
        this.loading = false;
      }
    });
    */
  }

  private redirectByRole(role: string): void {
    const roleRoutes: { [key: string]: string } = {
      'admin': '/admin/dashboard',
      'coordinator': '/coordinator/dashboard',
      'tutor': '/tutor/dashboard',
      'student': '/student/dashboard'
    };

    const route = roleRoutes[role] || '/dashboard';
    this.router.navigate([route]);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get role() {
    return this.loginForm.get('role');
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}