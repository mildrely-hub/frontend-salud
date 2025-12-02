import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ← IMPORTANTE: Agrega esto
import { AuthService, AuthResponse, Usuario } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,  // ← Si es standalone
  imports: [CommonModule, FormsModule], // ← Agrega FormsModule aquí
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;  // ← cargando -> isLoading
  errorMessage: string = '';   // ← errorMensaje -> errorMessage

  // Credenciales de demo
  credencialesDemo = [
    { email: 'admin@clinica.com', password: 'password123', rol: 'Admin' },
    { email: 'medico@clinica.com', password: 'password123', rol: 'Médico' },
    { email: 'paciente@email.com', password: 'password123', rol: 'Paciente' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingresa email y contraseña';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password)
      .then((response: AuthResponse) => {
        this.isLoading = false;
        
        switch(response.usuario.rol) {
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
      })
      .catch((error: any) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Error al iniciar sesión';
      });
  }

  // Método para usar credenciales de demo
  usarCredencialDemo(cred: any): void {
    this.email = cred.email;
    this.password = cred.password;
  }

  // Método para redirigir a registro
  irARegistro(): void {
    this.router.navigate(['/registro']);
  }
}