import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FlightService } from '../../services/flight';
import { BookingRequest } from '../../models/flight-app';

@Component({
  selector: 'app-book-flight',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './book-flight.html',
  styleUrl: './book-flight.css',
})
export class BookFlight {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private flightService = inject(FlightService);
  private router = inject(Router);

  flightId!: number;

  bookingForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    tripType: ['ONE_WAY', Validators.required],
    numberOfSeats: [1, [Validators.required, Validators.min(1)]],
    passengers: this.fb.array([])
  });

  get passengers() {
    return this.bookingForm.get('passengers') as FormArray;
  }

  ngOnInit() {
    this.flightId = Number(this.route.snapshot.paramMap.get('id'));
    this.syncPassengerForms();
  }

  syncPassengerForms() {
    const count = this.bookingForm.get('numberOfSeats')?.value || 1;
    while (this.passengers.length < count) {
      this.passengers.push(this.fb.group({
        name: ['', Validators.required],
        gender: ['MALE', Validators.required],
        age: [18, [Validators.required, Validators.min(0), Validators.max(100)]],
        mealType: ['VEG', Validators.required],
        seatNumber: ['', Validators.required]
      }));
    }
    while (this.passengers.length > count) {
      this.passengers.removeAt(this.passengers.length - 1);
    }
  }

  onBook() {
    if (this.bookingForm.valid) {
      const request = this.bookingForm.value as BookingRequest;
      this.flightService.bookFlight(this.flightId, request).subscribe({
        next: (res) => {
          alert(`Success! PNR: ${res.pnr}`);
          this.router.navigate(['/search']);
        },
        error: (err) => alert('Booking failed. Check your token or seats availability.')
      });
    }
  }
}
