import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { SearchFlights } from './components/search-flights/search-flights';
import { BookFlight } from './components/book-flight/book-flight';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'search', component: SearchFlights },
  { path: 'book/:id', component: BookFlight }
];
