import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { AdminComponent } from './pages/admin/resumen';
import { Usuarios } from './pages/usuarios/usuarios';
import { CitasComponent } from './pages/citas/citas';
import { AgendarCitaComponent } from './pages/citas/agendar-citas/agendar-cita';
import { RegistroComponent } from './pages/registro/registro';
import { MedicoComponent } from './pages/medico/medico'; // Nueva importación

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'usuarios', component: Usuarios },
  { path: 'citas', component: CitasComponent },
  { path: 'citas/citas', component: AgendarCitaComponent },
  { path: 'registro', component: RegistroComponent },
  
  // RUTA DEL MÉDICO (Crea la carpeta src/app/pages/medico)
  { path: 'medico', component: MedicoComponent }, 
  
  { path: '**', redirectTo: '/home' }
];