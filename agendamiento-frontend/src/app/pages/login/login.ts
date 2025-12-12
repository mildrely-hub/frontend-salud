// src/app/pages/login/login.ts
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
  correo: string = '';  // Cambia de 'email' a 'correo'
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

    // URL de tu backend Spring Boot
    const apiUrl = 'http://localhost:8080/api/auth/login'; // Ajusta el puerto si es necesario
    
    // Datos que espera el backend
    const loginData = {
      correo: this.correo,  // Cambia de 'email' a 'correo'
      password: this.password
    };

    // Llamada al backend
    this.http.post(apiUrl, loginData)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('Login exitoso:', response);
          
          // Guardar token JWT
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('usuario', JSON.stringify(response.usuario));
          }
          
          this.redirigirSegunRol(response.usuario);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error completo:', error);
          
          if (error.status === 400) {
            this.errorMessage = 'Datos inválidos. Verifica tu correo y contraseña';
          } else if (error.status === 401) {
            this.errorMessage = 'Credenciales incorrectas';
          } else if (error.status === 0) {
            this.errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté corriendo';
          } else {
            this.errorMessage = error.error?.message || 'Error en el servidor';
          }
        }
      });
  }

  private redirigirSegunRol(usuario: any): void {
    if (!usuario) return;
    
    const rol = usuario.rol || '';
    
    switch(rol.toUpperCase()) {
      case 'ADMINISTRADOR':
        this.router.navigate(['/admin']);
        break;
      case 'MEDICO':
        this.router.navigate(['/medico/dashboard']);
        break;
      case 'PACIENTE':
        this.router.navigate(['/paciente/dashboard']);
        break;
      default:
        this.router.navigate(['/home']);
    }
  }

  // Método para redirigir a registro
  irARegistro(): void {
    this.router.navigate(['/registro']);
  }
}