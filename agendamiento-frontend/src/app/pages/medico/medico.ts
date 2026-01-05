import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 30px; font-family: sans-serif;">
      <div style="background: #0d47a1; color: white; padding: 20px; border-radius: 10px;">
        <h1>Panel Médico</h1>
        <h3>Bienvenido, Dr/a. {{ nombreCompleto }}</h3>
      </div>
      <div style="margin-top: 20px; display: grid; gap: 20px;">
        <div style="border: 1px solid #ccc; padding: 15px; border-radius: 8px;">
          <h4>Próximas Citas</h4>
          <p>Usted no tiene citas pendientes para hoy.</p>
        </div>
        <button (click)="cerrarSesion()" style="width: 150px; padding: 10px; background: #d32f2f; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Cerrar Sesión
        </button>
      </div>
    </div>
  `
})
export class MedicoComponent implements OnInit {
  nombreCompleto: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.nombreCompleto = `${user.nombre} ${user.apellido}`;
    } else {
      this.router.navigate(['/login']);
    }
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}