import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlightService } from '../../services/flight';
import { FlightSummary } from '../../models/flight-app';

@Component({
  selector: 'app-search-flights',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-flights.html',
  styleUrl: './search-flights.css',
})
export class SearchFlights {
  private fb = inject(FormBuilder);
  private flightService = inject(FlightService);

  searchResults = signal<FlightSummary[]>([]);

  searchForm = this.fb.group({
    from: ['JFK', Validators.required],
    to: ['LHR', Validators.required],
    journeyDate: ['', Validators.required],
    tripType: ['ONE_WAY', Validators.required]
  });

  onSearch() {
    if (this.searchForm.valid) {
      const criteria = this.searchForm.value as any;
      
      this.flightService.searchFlights(criteria).subscribe(data => {
        // Update the signal with the new data
        this.searchResults.set(data);
      });
    }
  }
}
