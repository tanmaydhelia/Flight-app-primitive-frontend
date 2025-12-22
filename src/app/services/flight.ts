import { inject, Injectable } from '@angular/core';
import { AuthRequest, BookingRequest, FlightSearchRequest, FlightSummary, ItineraryDto, UserCredential } from '../models/flight-app';
import { delay, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class FlightService {

  private http = inject(HttpClient);
  private GATEWAY_URL = 'http://localhost:9000';

  constructor(){};

  login(request: AuthRequest): Observable<string> {
    console.log('Sending login to backend:', request);

    return this.http.post(`${this.GATEWAY_URL}/auth/token`, request, {responseType:'text'})
    .pipe(
      tap(token => {
        localStorage.setItem('token', token);
      })
    );
  }

  register(user: UserCredential): Observable<string> {
    console.log('Registering user:', user);
    
    return this.http.post(`${this.GATEWAY_URL}/auth/register`, user, {responseType:'text'});
  }

  searchFlights(criteria: FlightSearchRequest): Observable<FlightSummary[]> {
    console.log('Searching flights:', criteria);
        
    return this.http.post<FlightSummary[]>(`${this.GATEWAY_URL}/flight/api/search`, criteria);
  }

  bookFlight(flightId: number, request: BookingRequest): Observable<ItineraryDto> {
    return this.http.post<ItineraryDto>(
      `${this.GATEWAY_URL}/booking/api/book/${flightId}`, 
      request
    );
  }

  changePassword(request: any): Observable<string> {
    return this.http.put(`${this.GATEWAY_URL}/auth/change-password`, request, { responseType: 'text' });
  }

  cancelFlight(pnr: string): Observable<string> {
    return this.http.delete(`${this.GATEWAY_URL}/booking/api/cancel/${pnr}`, {responseType:'text'});
  }

  getBookingHistory(email: string): Observable<ItineraryDto[]>{
    return this.http.get<ItineraryDto[]>(`${this.GATEWAY_URL}/booking/api/history/${email}`);
  }

  getUserEmail(): string | null {
    const token = localStorage.getItem('token');
    if(!token) return null;
    try{
      const decoded: any = jwtDecode(token);
      return typeof decoded?.email === 'string' ? decoded.email : null;
    }
    catch(e){
      return null;
    }
  }

  getRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded?.role || null;
    } catch (e) {
      return null;
    }
  }

  getUsername(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded?.sub || null; // JWT 'sub' is usually the username
    } catch (e) {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getRole() === 'ROLE_ADMIN';
  }

  addFlightInventory(request: any): Observable<string> {
    return this.http.post(`${this.GATEWAY_URL}/flight/api/airline/inventory/add`, request, { responseType: 'text' });
  }
}
