import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, AuthResponse, Usuario } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  email: string = '';
  password: string = '';
  cargando: boolean = false;
  errorMensaje: string = '';
  
  // Credenciales de prueba
  demoCredentials = [
    { 
      tipo: 'Administrador', 
      correo: 'admin@mjsalud.com', 
      password: 'admin123',
      descripcion: 'Acceso completo al sistema'
    },
    { 
      tipo: 'Médico', 
      correo: 'medico@mjsalud.com', 
      password: 'medico123',
      descripcion: 'Gestión de citas y pacientes'
    },
    { 
      tipo: 'Paciente', 
      correo: 'paciente@mjsalud.com', 
      password: 'paciente123',
      descripcion: 'Agendar y ver citas'
    }
  ];

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // Si ya está autenticado, redirigir según rol
    if (this.authService.estaAutenticado()) {
      this.redireccionarSegunRol();
    }
  }

  onSubmit(): void {
    // Validaciones básicas
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMensaje = 'Por favor, completa todos los campos.';
      return;
    }

    if (!this.validarEmail(this.email)) {
      this.errorMensaje = 'Por favor, ingresa un correo electrónico válido.';
      return;
    }

    this.cargando = true;
    this.errorMensaje = '';

    console.log('Intentando login con:', { email: this.email });

    this.authService.login(this.email, this.password).subscribe({
      next: (response: AuthResponse) => {
        console.log('Login exitoso:', response);
        
        // Guardar datos en localStorage
        this.authService.guardarToken(response.token);
        this.authService.guardarUsuario(response.usuario);
        
        this.cargando = false;
        
        // Redireccionar según el rol
        this.redireccionarSegunRol();
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.cargando = false;
        
        // Manejar diferentes tipos de errores
        if (error.status === 401) {
          this.errorMensaje = 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.';
        } else if (error.status === 0 || error.status === 504) {
          this.errorMensaje = 'No se puede conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:8080';
        } else if (error.status === 400) {
          this.errorMensaje = error.error?.message || 'Datos inválidos. Por favor, verifica la información.';
        } else {
          this.errorMensaje = `Error en el servidor: ${error.status || 'Desconocido'}. Por favor, intenta más tarde.`;
        }
      }
    });
  }

  private redireccionarSegunRol(): void {
    const usuario = this.authService.obtenerUsuario();
    
    if (!usuario) {
      this.router.navigate(['/']);
      return;
    }

    console.log('Redireccionando para rol:', usuario.rol);

    switch (usuario.rol.toUpperCase()) {
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
        console.warn('Rol desconocido:', usuario.rol);
        this.router.navigate(['/']);
    }
  }

  private validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Método para usar credenciales de prueba
  usarCredencialDemo(credencial: any): void {
    this.email = credencial.correo;
    this.password = credencial.password;
    
    // Auto-enviar después de un breve delay
    setTimeout(() => {
      this.onSubmit();
    }, 300);
  }

  limpiarFormulario(): void {
    this.email = '';
    this.password = '';
    this.errorMensaje = '';
  }
}