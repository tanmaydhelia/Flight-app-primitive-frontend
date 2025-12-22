import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { SearchFlights } from './components/search-flights/search-flights';
import { BookFlight } from './components/book-flight/book-flight';
import { Profile } from './components/profile/profile';
import { adminGuard } from './guard/admin-guard';
import { ChangePassword } from './components/change-password/change-password';
import { AdminPanel } from './components/admin-panel/admin-panel';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'search', component: SearchFlights },
  { path: 'book/:id', component: BookFlight },
  { path: 'profile', component: Profile },
  { path: 'profile', component: Profile },
  { path: 'change-password', component: ChangePassword },
  { path: 'admin', component: AdminPanel, canActivate: [adminGuard] }
];
