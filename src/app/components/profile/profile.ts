import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FlightService } from '../../services/flight';
import { ItineraryDto } from '../../models/flight-app';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private flightService = inject(FlightService);

  bookings = signal<ItineraryDto[]>([]); 
  userEmail = signal<string | null>(null);

  ngOnInit(): void {
    const email = this.flightService.getUserEmail();
    this.userEmail.set(email);
    console.log(this.userEmail);

    if (email) {
      this.loadBookings(email);
    } else {
      console.error('No user identity found in token');
    }
  }

  loadBookings(email: string) {
    this.flightService.getBookingHistory(email).subscribe({
      next: (data) => {
        this.bookings.set(data);
        console.log('Bookings updated via Signal:', data);
      },
      error: (err) => console.error('Error Loading History', err),
    });
  }

  onCancel(pnr: string) {
    if (confirm(`Are you sure--Cancel ${pnr}`)) {
      this.flightService.cancelFlight(pnr).subscribe({
        next: (msg) => {
          alert(msg);
          const currentEmail = this.userEmail();
          if (currentEmail) this.loadBookings(currentEmail);
        },
        error: (err) => console.error(`Cancellation Failed for pnr: ${pnr}` + err.message),
      });
    }
  }
}
