import { Routes } from '@angular/router';
import { Paths } from './core/constans/paths';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: Paths.STUDENTS,
    loadComponent: () =>
      import('./components/public/students/students.component').then(
        (component) => component.StudentsComponent,
      ),
  },
  {
    path: Paths.ADDRESSES,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/public/addresses/addresses.component').then(
        (component) => component.AddressesComponent,
      ),
  },
  {
    path: '**',
    redirectTo: Paths.STUDENTS,
  },
];
