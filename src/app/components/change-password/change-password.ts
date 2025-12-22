import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlightService } from '../../services/flight';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {
  private fb = inject(FormBuilder);
  private flightService = inject(FlightService);
  private router = inject(Router);

  passwordForm = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  message = "";

  onSubmit() {
    if (this.passwordForm.valid) {
      const request = {
        username: this.flightService.getUsername(),
        oldPassword: this.passwordForm.value.oldPassword,
        newPassword: this.passwordForm.value.newPassword
      };

      this.flightService.changePassword(request).subscribe({
        next: (res) => {
          this.message = res;
          setTimeout(() => this.router.navigate(['/profile']), 2000);
        },
        error: (err) => this.message = "Failed to change password."
      });
    }
  }
}
