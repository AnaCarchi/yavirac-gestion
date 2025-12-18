import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN', 'admin'])],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'coordinator',
    canActivate: [authGuard, roleGuard(['ROLE_COORDINATOR', 'coordinator'])],
    loadChildren: () => import('./features/coordinator/coordinator.routes')
      .then(m => m.COORDINATOR_ROUTES)
  },
  {
    path: 'tutor',
    canActivate: [authGuard, roleGuard(['ROLE_TUTOR', 'tutor'])],
    loadChildren: () => import('./features/tutor/tutor.routes').then(m => m.TUTOR_ROUTES)
  },
  {
    path: 'student',
    canActivate: [authGuard, roleGuard(['ROLE_STUDENT', 'student'])],
    loadChildren: () => import('./features/student/student.routes')
      .then(m => m.STUDENT_ROUTES)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized.component')
      .then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component')
      .then(m => m.NotFoundComponent)
  }
];