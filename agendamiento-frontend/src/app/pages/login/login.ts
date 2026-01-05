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

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit(): void {
    if (!this.correo || !this.password) {
      this.errorMessage = 'Por favor ingresa correo y contraseña';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginData = {
      correo: this.correo.trim(),
      password: this.password
    };

    this.http.post('http://localhost:8080/api/auth/login', loginData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
          
          // Obtener el rol directamente del objeto usuario de la respuesta
          const rol = response.usuario.rol;
          this.redirigirSegunRol(rol);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error de autenticación:', error);
        this.errorMessage = 'Credenciales inválidas. Intente de nuevo.';
      }
    });
  }

  private redirigirSegunRol(rol: string): void {
    if (!rol) {
      this.router.navigate(['/home']);
      return;
    }

    const roleUpper = rol.toUpperCase();
    console.log('Detectado Rol:', roleUpper);

    // Lógica de redirección solicitada
    if (roleUpper === 'MEDICO') {
      this.router.navigate(['/medico']);
    } else if (roleUpper === 'PACIENTE') {
      this.router.navigate(['/citas']);
    } else if (roleUpper === 'ADMINISTRADOR') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }
}