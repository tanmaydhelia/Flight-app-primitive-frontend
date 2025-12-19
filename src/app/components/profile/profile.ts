import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FlightService } from '../../services/flight';
import { ItineraryDto } from '../../models/flight-app';

@Component({
  selector: 'app-profile',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})

export class Profile implements OnInit{
  private flightService = inject(FlightService);
  bookings: ItineraryDto[] = [];
  userEmail: string | null = null;
  
  ngOnInit(): void{
    this.userEmail = this.flightService.getUserEmail();
    console.log(this.userEmail);
    
    if (this.userEmail) {
      this.loadBookings(this.userEmail);
    } else {
      console.error('No user identity found in token');
    }
  }
 


  loadBookings(email: string | null){
    if (!email) {
      console.warn('Cannot Load Bookings without an email!!!!');
      return;
    }


    this.flightService.getBookingHistory(email).subscribe({
      next: (data) => this.bookings = data,
      error: (err) => console.error("Error Loading History", err)
    });

    console.log(this.bookings);
    

  }

  onCancel(pnr: string){
    if(confirm(`Are you sure--Cancel ${pnr}`)){
      this.flightService.cancelFlight(pnr).subscribe({
        next: (msg) => {
          alert(msg);
          this.loadBookings(this.userEmail);
        },
        error: (err) => console.error(`Cancellation Failed for pnr: ${pnr}` + err.message)
      })
    }
  }

}
