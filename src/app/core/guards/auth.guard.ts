import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const data = localStorage.getItem('data');

  if (!data) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
