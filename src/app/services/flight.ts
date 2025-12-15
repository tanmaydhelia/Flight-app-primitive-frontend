import { Injectable } from '@angular/core';
import { AuthRequest, FlightSearchRequest, FlightSummary, UserCredential } from '../models/flight-app';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private mockFlights: FlightSummary[] = [
    {
      flightId: 101,
      airlineName: 'Angular Air',
      price: 550,
      fromAirport: 'JFK',
      toAirport: 'LHR',
      departureTime: '2025-12-15T10:00:00',
      arrivalTime: '2025-12-15T22:00:00',
      availableSeats: 42
    }
  ];

  // 2. Login Logic
  login(request: AuthRequest): Observable<boolean> {
    console.log('Sending login to backend:', request);
    // 'of(true)' creates a fake successful response
    // 'delay(1000)' simulates network lag
    return of(true).pipe(delay(1000));
  }

  // 3. Registration Logic
  register(user: UserCredential): Observable<boolean> {
    console.log('Registering user:', user);
    return of(true).pipe(delay(1000));
  }

  // 4. Search Logic
  searchFlights(criteria: FlightSearchRequest): Observable<FlightSummary[]> {
    console.log('Searching flights:', criteria);
    // Simple filter to mimic backend search
    const results = this.mockFlights.filter(f => 
      f.fromAirport === criteria.from && f.toAirport === criteria.to
    );
    return of(results).pipe(delay(800));
  }
}
