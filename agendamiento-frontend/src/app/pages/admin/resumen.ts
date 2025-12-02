import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth';

@Component({
  selector: 'app-admin',
  templateUrl: './resumen.html',
  styleUrls: ['./resumen.css']
})
export class AdminComponent implements OnInit {
  
  usuario: Usuario | null = null;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.usuario = this.authService.obtenerUsuario();
    
    if (!this.authService.esAdministrador()) {
      this.router.navigate(['/home']);
      return;
    }
  }
  
  // Método para cerrar sesión (llamado salir en el template)
  salir(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}