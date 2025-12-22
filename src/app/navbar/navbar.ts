import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FlightService } from '../services/flight';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar {
  public flightService = inject(FlightService);
  private router = inject(Router);

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
