import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // ← Agrega esto
import { AuthService, Usuario } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true, // ← Si es standalone
  imports: [CommonModule], // ← Agrega CommonModule aquí
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  
  isLoggedIn: boolean = false;
  usuario: Usuario | null = null;
  
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    setTimeout(() => {
      this.isLoggedIn = this.authService.estaAutenticado();
      this.usuario = this.authService.obtenerUsuario();
      console.log('Navbar init - isLoggedIn:', this.isLoggedIn, 'usuario:', this.usuario);
    }, 0);
  }
  
  redirigirSegunRol(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    
    const usuario = this.authService.obtenerUsuario();
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }
    
    switch(usuario.rol) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'MEDICO':
        this.router.navigate(['/medico']);
        break;
      case 'PACIENTE':
        this.router.navigate(['/citas']);
        break;
      default:
        this.router.navigate(['/home']);
    }
  }
  
  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.isLoggedIn = false;
    this.usuario = null;
    this.router.navigate(['/login']);
  }
}