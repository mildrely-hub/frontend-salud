import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen.html',
  styleUrls: ['./resumen.css']
})
export class Resumen implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  usuario = this.authService.obtenerUsuario();
  estadisticas = {
    totalUsuarios: 24,
    pacientesActivos: 15,
    medicos: 6,
    citasHoy: 8,
    ingresosTotales: 12500,
    citasPendientes: 12
  };

  ngOnInit(): void {
    // Verificar autenticación y rol
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/admin-dashboard' }
      });
      return;
    }

    if (!this.authService.esAdministrador()) {
      this.router.navigate(['/']);
      return;
    }

    console.log('Admin Dashboard cargado para:', this.usuario?.nombreCompleto);
  }

  salir(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }

  // Método para obtener estadísticas (simulado por ahora)
  cargarEstadisticas(): void {
    console.log('Cargando estadísticas...');
    // Aquí iría la llamada al backend cuando implementes el servicio
  }
}