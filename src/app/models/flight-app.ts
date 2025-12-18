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
  airlineCode: string;
  price: number;
  fromAirport: string;
  toAirport: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
}

export interface PassengerRequest {
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  age: number;
  mealType: 'VEG' | 'NON_VEG';
  seatNumber: string;
}

export interface BookingRequest {
  name: string;
  email: string;
  tripType: 'ONE_WAY' | 'ROUND_TRIP';
  returnFlightId?: number;
  numberOfSeats: number;
  passengers: PassengerRequest[];
}

export interface PassengerDto {
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER'; // Based on Gender.java
  age: number;
  mealType: 'VEG' | 'NON_VEG'; // Based on MealType.java
  seatNumber: string;
}

export interface LegDto {
  bookingId: number;
  flightId: number;
  fromAirport: string;
  toAirport: string;
  departureTime: string; // LocalDateTime handled as ISO string
  arrivalTime: string;   // LocalDateTime handled as ISO string
  segmentType: 'OUTBOUND' | 'INBOUND'; // Based on TripSegmentType.java
  status: 'BOOKED' | 'CANCELLED';      // Based on BookingStatus.java
  passengers: PassengerDto[];
}

// Matches com.flightbookingservice.dto.ItineraryDto
export interface ItineraryDto {
  pnr: string;
  userName: string;
  email: string;
  status: 'BOOKED' | 'CANCELLED'; // Based on BookingStatus.java
  totalAmount: number;            // Mapped from totalAmount in ItineraryDto.java
  createdTime: string;            // LocalDateTime
  legs: LegDto[];                 // Mapped from List<LegDto> in ItineraryDto.java
}