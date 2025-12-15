import { inject, Injectable } from '@angular/core';
import { AuthRequest, FlightSearchRequest, FlightSummary, UserCredential } from '../models/flight-app';
import { delay, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FlightService {

  private http = inject(HttpClient);
  private GATEWAY_URL = 'http://localhost:9000';

  constructor(){};

  // private mockFlights: FlightSummary[] = [
  //   {
  //     flightId: 101,
  //     airlineName: 'Angular Air',
  //     price: 550,
  //     fromAirport: 'JFK',
  //     toAirport: 'LHR',
  //     departureTime: '2025-12-15T10:00:00',
  //     arrivalTime: '2025-12-15T22:00:00',
  //     availableSeats: 42
  //   }
  // ];

  // 2. Login Logic
  login(request: AuthRequest): Observable<string> {
    console.log('Sending login to backend:', request);

    return this.http.post(`${this.GATEWAY_URL}/auth/token`, request, {responseType:'text'})
    .pipe(
      tap(token => {
        localStorage.setItem('token', token);
      })
    );
  }

  // 3. Registration Logic
  register(user: UserCredential): Observable<string> {
    console.log('Registering user:', user);
    
    return this.http.post(`${this.GATEWAY_URL}/auth/register`, user, {responseType:'text'});
  }

  // 4. Search Logic
  searchFlights(criteria: FlightSearchRequest): Observable<FlightSummary[]> {
    console.log('Searching flights:', criteria);
    // Simple filter to mimic backend search
    
    return this.http.post<FlightSummary[]>(`${this.GATEWAY_URL}/flight/api/search`, criteria);
  }

}
