import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FlightService } from '../../services/flight';
import { BookingRequest } from '../../models/flight-app';

@Component({
  selector: 'app-book-flight',
  standalone: true,
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
  occupiedSeats: string[] = [];
  selectedSeats: string[] = [];
  rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  activePassengerIndex: number = 0;

  ngOnInit() {
    this.flightId = Number(this.route.snapshot.paramMap.get('id'));
    this.syncPassengerForms();
    this.loadOccupiedSeats();
  }

  bookingForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    tripType: ['ONE_WAY', Validators.required],
    numberOfSeats: [1, [Validators.required, Validators.min(1)]],
    passengers: this.fb.array([]),
  });

  get passengers() {
    return this.bookingForm.get('passengers') as FormArray;
  }

  loadOccupiedSeats() {
    this.flightService.getOccupiedSeats(this.flightId).subscribe({
      next: (seats) => (this.occupiedSeats = seats),
      error: () => console.error('Could not load seat map'),
    });
  }

  isOccupied(seat: string): boolean {
    return this.occupiedSeats.includes(seat);
  }

  isSelected(seat: string): boolean {
    return this.selectedSeats.includes(seat);
  }

  handleSeatSelection(seat: string) {
    const limit = this.bookingForm.get('numberOfSeats')?.value || 0;

    if (this.isSelected(seat)) {
      this.selectedSeats = this.selectedSeats.filter((s) => s !== seat);
    } else {
      if (this.selectedSeats.length < limit) {
        this.selectedSeats.push(seat);
      } else {
        alert(`You can only select ${limit} seat(s).`);
      }
    }
    this.autoAssignSeatsToPassengers();
  }

  autoAssignSeatsToPassengers() {
    this.selectedSeats.forEach((seat, index) => {
      if (this.passengers.at(index)) {
        this.passengers.at(index).get('seatNumber')?.setValue(seat);
      }
    });
  }
  selectSeat(seatId: string) {
    if (this.isOccupied(seatId)) return;

    // Assign the selected seat to the currently active passenger form
    const passengerForm = this.passengers.at(this.activePassengerIndex);
    if (passengerForm) {
      passengerForm.get('seatNumber')?.setValue(seatId);
      
      // Automatically move to the next passenger if available
      if (this.activePassengerIndex < this.passengers.length - 1) {
        this.activePassengerIndex++;
      }
    }
  }

  setActivePassenger(index: number) {
    this.activePassengerIndex = index;
  }

  syncPassengerForms() {
    const count = this.bookingForm.get('numberOfSeats')?.value || 1;
    while (this.passengers.length < count) {
      this.passengers.push(
        this.fb.group({
          name: ['', Validators.required],
          gender: ['MALE', Validators.required],
          age: [18, [Validators.required, Validators.min(0), Validators.max(100)]],
          mealType: ['VEG', Validators.required],
          seatNumber: ['', Validators.required],
        })
      );
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
        error: (err) => alert('Booking failed. Check your token or seats availability.'),
      });
    }
  }
}
