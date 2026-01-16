import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isLoggedIn(): boolean {
    return this.authService.estaAutenticado();
  }

  esAdministrador(): boolean {
    return this.authService.esAdministrador();
  }

  esMedico(): boolean {
    return this.authService.esMedico();
  }

  esPaciente(): boolean {
    return this.authService.esPaciente();
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }

  redirigirSegunRol(): void {
    const usuario = this.authService.obtenerUsuario();
    
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    switch (usuario.rol) {
      case 'ADMINISTRADOR':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'MEDICO':
        this.router.navigate(['/medico']);
        break;
      case 'PACIENTE':
        this.router.navigate(['/citas']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}