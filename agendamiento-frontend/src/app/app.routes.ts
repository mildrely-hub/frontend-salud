import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Login } from './pages/login/login';
import { Usuarios } from './pages/usuarios/usuarios'; // <- Cambiado de UsuariosComponent a Usuarios
import { Resumen } from './pages/admin/resumen';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: Login },
  { path: 'usuarios', component: Usuarios }, // <- Cambiado aquí también
  { path: 'admin-dashboard', component: Resumen },
  { path: 'admin/resumen', component: Resumen },
  { path: '**', redirectTo: '' }
];