import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { AdminComponent } from './pages/admin/resumen';
import { Usuarios } from './pages/usuarios/usuarios';  // ← Cambiado: Usuarios (no UsuariosComponent)
import { CitasComponent } from './pages/citas/citas';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'usuarios', component: Usuarios },  // ← Cambiado: Usuarios
  { path: 'citas', component: CitasComponent },
  { path: '**', redirectTo: '/home' }
];