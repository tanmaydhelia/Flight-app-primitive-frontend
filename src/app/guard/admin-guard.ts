import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FlightService } from '../services/flight';

export const adminGuard: CanActivateFn = (route, state) => {
  const flightService = inject(FlightService);
  const router = inject(Router);

  if(flightService.isAdmin()){
    return true;
  } 
  else{
    router.navigate(['/search']);
    return false;
  }
};
