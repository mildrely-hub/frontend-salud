// src/app/pages/citas/citas.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './citas.html',
  styleUrls: ['./citas.css']
})
export class CitasComponent implements OnInit {
  
  usuario: any = null;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario();
    console.log('Usuario en citas:', this.usuario);
  }
  
  irAAgendarCita(): void {
    this.router.navigate(['/citas/agendar']);
  }
  
  verDetallesCita(cita: any): void {
    console.log('Ver detalles:', cita);
    alert(`Detalles de cita:\nFecha: ${cita.fecha}\nMédico: ${cita.medico}\nEstado: ${cita.estado}`);
  }
  
  cancelarCita(cita: any): void {
    if (confirm(`¿Cancelar cita con ${cita.medico} el ${cita.fecha}?`)) {
      console.log('Cita cancelada:', cita);
      alert('Cita cancelada exitosamente');
    }
  }
  
  confirmarCita(cita: any): void {
    console.log('Confirmar cita:', cita);
    alert('Cita confirmada exitosamente');
  }
}