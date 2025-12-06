import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  return true; //borrar 
  
  // const authService = inject(AuthService);
  // const router = inject(Router);

  // if (authService.isAuthenticated()) { //conectar 
  //   return true;
  // }

  // router.navigate(['/auth/login'], { 
  //   queryParams: { returnUrl: state.url } 
  // });
  // return false;
};