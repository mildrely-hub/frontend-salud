import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class Usuarios {
  usuarios = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', rol: 'Paciente', fechaRegistro: '2024-01-15' },
    { id: 2, nombre: 'María García', email: 'maria@example.com', rol: 'Médico', fechaRegistro: '2024-01-10' },
    { id: 3, nombre: 'Admin Sistema', email: 'admin@example.com', rol: 'Administrador', fechaRegistro: '2024-01-01' }
  ];

  constructor() {
    console.log('Componente Usuarios cargado');
  }
}