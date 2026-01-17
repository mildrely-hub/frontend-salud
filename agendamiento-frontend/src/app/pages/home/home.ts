// src/app/pages/home/home.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  // Navegar a Login
  irALogin(): void {
    this.router.navigate(['/login']);
  }

  // Navegar a Registro
  irARegistro(): void {
    this.router.navigate(['/registro']);
  }

  // Navegar a Agendar Cita (redirige a login)
  irAAgendarCita(): void {
    this.router.navigate(['/login']);
  }

  // Información de doctores
  doctores = [
    {
      nombre: 'Dr. Carlos Rodríguez',
      especialidad: 'Cardiólogo',
      experiencia: '15 años',
      foto: 'assets/doctor-1.png',
      descripcion: 'Especialista en enfermedades cardiovasculares y prevención de riesgos cardíacos.'
    },
    {
      nombre: 'Dra. Ana Martínez',
      especialidad: 'Dermatóloga',
      experiencia: '12 años',
      foto: 'assets/doctor-2.png',
      descripcion: 'Experta en cuidado de la piel, tratamientos dermatológicos y estética facial.'
    },
    {
      nombre: 'Dr. Luis Gómez',
      especialidad: 'Médico General',
      experiencia: '10 años',
      foto: 'assets/doctor-3.png',
      descripcion: 'Atención integral para toda la familia, diagnóstico general y seguimiento médico.'
    }
  ];

  // Información de contacto
  contacto = {
    telefono: '8888-8888',
    email: 'info@mjsalud.com',
    direccion: 'Calle Principal #123, Ciudad',
    horario: 'Lunes a Viernes: 8:00 AM - 6:00 PM<br>Sábados: 8:00 AM - 12:00 PM'
  };
}