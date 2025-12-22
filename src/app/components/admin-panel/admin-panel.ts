import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlightService } from '../../services/flight';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule],
  providers:[DatePipe],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  private fb = inject(FormBuilder);
  private flightService = inject(FlightService);
  private datePipe = inject(DatePipe);

  flightForm = this.fb.group({
    airlineCode: ['', Validators.required],
    fromAirport: ['', Validators.required],
    toAirport: ['', Validators.required],
    departureTime: ['', Validators.required], 
    arrivalTime: ['', Validators.required],   // Should be string 'dd//yy hh:mm a'
    price: [0, [Validators.required, Validators.min(1)]],
    totalSeats: [60, [Validators.required, Validators.min(1)]],
    availabeSeats: [60, [Validators.required, Validators.min(0)]]
  });

  status = '';

  private formatDateForBackend(dateString: string): string {
    if (!dateString) return '';
    // Format to match backend pattern: "dd/MM/yy hh:mm a"
    return this.datePipe.transform(dateString, 'yyyy-MM-ddTHH:mm:ss') || '';
  }

  addInventory() {
    if (this.flightForm.valid) {

      const formValue = this.flightForm.value;


      const payload = {
        airlineCode: formValue.airlineCode,
        flights: [{
          fromAirport: formValue.fromAirport,
          toAirport: formValue.toAirport,
          departureTime: this.formatDateForBackend(formValue.departureTime!),
          arrivalTime: this.formatDateForBackend(formValue.arrivalTime!),
          price: formValue.price,
          totalSeats: formValue.totalSeats,
          availabeSeats: formValue.availabeSeats
        }]
      };

      console.log("Sending payload:", payload);

      this.flightService.addFlightInventory(payload).subscribe({
        next: (res) => {
          this.status = "Flight added successfully!";
          this.flightForm.reset({ totalSeats: 60, availabeSeats: 60 });
        },
        error: (err) => {
          console.error("Validation Error:", err);
          this.status = "Error: " + (err.error?.message || "Check console for details");

        }
      });
    }
  }
}
