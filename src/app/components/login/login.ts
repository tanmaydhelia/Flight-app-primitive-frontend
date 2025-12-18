import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FlightService } from '../../services/flight';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private flightService = inject(FlightService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  errorMessage = '';
  isLoading = false;

  onSubmit() {
    if (this.loginForm.valid) {
      this.errorMessage = '';
      this.isLoading = true;
      const request = this.loginForm.value as any;
      
      this.flightService.login(request).subscribe({
        next: (token) => {
          console.log('Login successful, Token:', token);
          this.isLoading = false;
          this.router.navigate(['/search']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Invalid username or password. Please try again.';
          console.error('Login error:', err);
        }
      });
    }
  }
}
