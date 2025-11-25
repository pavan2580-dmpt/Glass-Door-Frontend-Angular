import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = localStorage.getItem('authToken');
  const router = inject(Router);
  if (isAuthenticated) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
