import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FlightService } from '../../services/flight';
import { ItineraryDto } from '../../models/flight-app';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private flightService = inject(FlightService);
  private router = inject(Router);

  bookings = signal<ItineraryDto[]>([]); 
  userEmail = signal<string | null>(null);
  showModal = signal(false);
  pnrToCancel = signal<string | null>(null);

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

  openCancelPopup(pnr: string) {
    this.pnrToCancel.set(pnr);
    this.showModal.set(true);
  }

  closePopup() {
    this.showModal.set(false);
    this.pnrToCancel.set(null);
  }

  confirmCancellation() {
    const pnr = this.pnrToCancel();
    if (pnr) {
      this.flightService.cancelFlight(pnr).subscribe({
        next: () => {
          this.closePopup();
          const email = this.userEmail();
          if (email) this.loadBookings(email);
        },
        error: (err) => alert("Error: " + err.message)
      });
    }
  }
}
