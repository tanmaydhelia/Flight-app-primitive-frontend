export interface AuthRequest {
  username: string;
  password: string;
}

export interface UserCredential {
  name: string;
  email: string;
  password: string;
}

export interface FlightSearchRequest {
  from: string;
  to: string;
  journeyDate: string;
  tripType: 'ONE_WAY' | 'ROUND_TRIP';
  returnDate?: string;
}

export interface FlightSummary {
  flightId: number;
  airlineName: string;
  price: number;
  fromAirport: string;
  toAirport: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
}