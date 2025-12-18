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
  hasSearched = signal(false);
  isLoading = signal(false);

  minDate = new Date().toISOString().split('T')[0];

  searchForm = this.fb.group({
    from: ['DEL', Validators.required],
    to: ['VNS', Validators.required],
    journeyDate: ['', Validators.required],
    tripType: ['ONE_WAY', Validators.required]
  });

  onSearch() {
    if (this.searchForm.valid) {
      this.isLoading.set(true);
      this.hasSearched.set(true);
      
      const request = this.searchForm.value as any;

      this.flightService.searchFlights(request).subscribe({
        next: (data) => {
          this.searchResults.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Search failed', err);
          this.isLoading.set(false);
          alert('Could not fetch flights. Check console for details.');
        }
      });
    }
  }
}
