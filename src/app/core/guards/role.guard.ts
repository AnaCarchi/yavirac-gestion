import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    
    return true; //borrar

    /* 
    // DESCOMENTAR ESTO CUANDO TENGAS EL BACKEND FUNCIONANDO:
    
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUser();
    
    if (!user) {
      router.navigate(['/auth/login']);
      return false;
    }

    const hasRole = user.roles?.some(role => 
      allowedRoles.some(allowedRole => 
        role.name.toLowerCase() === allowedRole.toLowerCase()
      )
    );

    if (hasRole) {
      return true;
    }

    router.navigate(['/unauthorized']);
    return false;
    */
  };
};