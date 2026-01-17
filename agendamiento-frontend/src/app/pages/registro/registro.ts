// src/app/pages/registro/registro.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  // Datos del formulario
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  telefono: string = '';
  tipoUsuario: string = 'paciente';
  fechaNacimiento: string = '';
  genero: string = '';
  direccion: string = '';
  dni: string = '';

  // Estados
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // URL de tu backend - AJUSTA ESTO SEGÚN TU BACKEND
  private apiUrl = 'http://localhost:3000'; // Ejemplo: http://localhost:3000/api

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // Validar contraseñas
  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  // Validar DNI (ejemplo para Costa Rica)
  validarDNI(): boolean {
    if (!this.dni) return true; // DNI es opcional
    const dniRegex = /^\d{1,12}$/;
    return dniRegex.test(this.dni);
  }

  // Validar teléfono
  validarTelefono(): boolean {
    if (!this.telefono) return true; // Teléfono es opcional
    const telefonoRegex = /^[\d\s\-\+\(\)]{8,15}$/;
    return telefonoRegex.test(this.telefono);
  }

  // Calcular fortaleza de contraseña
  getPasswordStrength(): number {
    if (!this.password) return 0;
    
    let strength = 0;
    
    // Longitud mínima
    if (this.password.length >= 8) strength += 25;
    
    // Contiene mayúsculas
    if (/[A-Z]/.test(this.password)) strength += 25;
    
    // Contiene números
    if (/[0-9]/.test(this.password)) strength += 25;
    
    // Contiene caracteres especiales
    if (/[^A-Za-z0-9]/.test(this.password)) strength += 25;
    
    return strength;
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    
    if (strength === 0) return 'Ninguna';
    if (strength <= 25) return 'Débil';
    if (strength <= 50) return 'Regular';
    if (strength <= 75) return 'Buena';
    return 'Excelente';
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    
    if (strength <= 25) return '#e74c3c'; // Rojo
    if (strength <= 50) return '#f39c12'; // Naranja
    if (strength <= 75) return '#3498db'; // Azul
    return '#2ecc71'; // Verde
  }

  // Validar formulario completo
  validarFormulario(): boolean {
    // Resetear mensaje de error
    this.errorMessage = '';

    // Validaciones básicas
    if (!this.nombre.trim()) {
      this.errorMessage = 'El nombre es obligatorio';
      return false;
    }

    if (!this.apellido.trim()) {
      this.errorMessage = 'El apellido es obligatorio';
      return false;
    }

    if (!this.email.trim()) {
      this.errorMessage = 'El email es obligatorio';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Ingresa un email válido';
      return false;
    }

    if (!this.password) {
      this.errorMessage = 'La contraseña es obligatoria';
      return false;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return false;
    }

    if (!this.passwordsMatch()) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return false;
    }

    if (!this.validarDNI()) {
      this.errorMessage = 'El DNI debe contener solo números (máx 12 dígitos)';
      return false;
    }

    if (!this.validarTelefono()) {
      this.errorMessage = 'Teléfono inválido. Use solo números y símbolos + - ( )';
      return false;
    }

    return true;
  }

  // Método para registrar
  async onSubmit(): Promise<void> {
    if (!this.validarFormulario()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Datos a enviar al backend
    const userData = {
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      email: this.email.trim().toLowerCase(),
      password: this.password,
      telefono: this.telefono.trim() || null,
      tipo_usuario: this.tipoUsuario,
      fecha_nacimiento: this.fechaNacimiento || null,
      genero: this.genero || null,
      direccion: this.direccion.trim() || null,
      dni: this.dni.trim() || null,
      fecha_registro: new Date().toISOString(),
      estado: 'activo'
    };

    try {
      // AJUSTA ESTA RUTA SEGÚN TU BACKEND
      const response: any = await this.http.post(`${this.apiUrl}/api/usuarios/registro`, userData).toPromise();
      
      if (response.success || response.id) {
        this.successMessage = '¡Registro exitoso! Redirigiendo al login...';
        
        // Esperar 2 segundos y redirigir al login
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      } else {
        this.errorMessage = response.message || 'Error en el registro. Intenta nuevamente.';
      }
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      if (error.status === 409) {
        this.errorMessage = 'Este email ya está registrado. Usa otro email o recupera tu cuenta.';
      } else if (error.status === 400) {
        this.errorMessage = error.error?.message || 'Datos inválidos. Verifica la información.';
      } else {
        this.errorMessage = 'Error al conectar con el servidor. Intenta nuevamente más tarde.';
      }
    } finally {
      this.isLoading = false;
    }
  }

  // Volver al login
  volverAlLogin(): void {
    this.router.navigate(['/login']);
  }

  // Alternar visibilidad de contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Calcular edad mínima (18 años)
  getMinBirthDate(): string {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return minDate.toISOString().split('T')[0];
  }

  getMaxBirthDate(): string {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  }
}