import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  correo: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  onSubmit(): void {
    if (!this.correo || !this.password) {
      this.errorMessage = 'Por favor ingresa correo y contraseña';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginData = {
      correo: this.correo,
      password: this.password
    };

    this.http.post('http://localhost:8080/api/auth/login', loginData)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          
          if (response.token) {
            // Guardar token y datos del usuario
            localStorage.setItem('token', response.token);
            localStorage.setItem('usuario', JSON.stringify(response.usuario));
            localStorage.setItem('rolUsuario', response.usuario.rol);
            localStorage.setItem('idUsuario', response.usuario.id);
            
            this.redirigirSegunRol(response.usuario);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = this.obtenerMensajeError(error);
        }
      });
  }

  private redirigirSegunRol(usuario: any): void {
    const rol = (usuario.rol || '').toUpperCase();
    
    if (rol === 'PACIENTE') {
      this.router.navigate(['/citas/agendar-cita']);
    } else {
      this.router.navigate(['/citas']);
    }
  }

  private obtenerMensajeError(error: any): string {
    if (error.status === 0) return 'No se puede conectar al servidor.';
    if (error.status === 401) return 'Correo o contraseña incorrectos.';
    return error.error?.message || 'Ocurrió un error inesperado.';
  }

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }
}