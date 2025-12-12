// src/app/pages/registro/registro.ts - VERSIÓN COMPLETA CON NUEVO DISEÑO
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  // ✅ CAMPOS REQUERIDOS según AuthDTO.RegisterRequest
  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  password: string = '';
  confirmPassword: string = '';
  telefono: string = '';
  rol: string = 'PACIENTE'; // 'PACIENTE' o 'MEDICO'
  direccion: string = '';

  // ✅ CAMPOS OPCIONALES (para información adicional)
  dni: string = '';
  fechaNacimiento: string = '';
  genero: string = 'MASCULINO'; // 'MASCULINO', 'FEMENINO', 'OTRO'

  // ✅ NUEVA PROPIEDAD PARA CONTROLAR SECCIÓN OPCIONAL
  showOptional: boolean = false;

  // Estados
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // URL del backend Spring Boot
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // ✅ NUEVO MÉTODO: Alternar sección opcional
  toggleOptionalSection(): void {
    this.showOptional = !this.showOptional;
  }

  // Validar que las contraseñas coincidan
  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  // ✅ Validar teléfono de 9 dígitos exactos
  validarTelefono(): boolean {
    if (!this.telefono) return false;
    const telefonoRegex = /^[0-9]{9}$/;
    return telefonoRegex.test(this.telefono);
  }

  // Calcular fortaleza de contraseña
  getPasswordStrength(): number {
    if (!this.password) return 0;
    
    let strength = 0;
    
    // Longitud mínima 8 caracteres
    if (this.password.length >= 8) strength += 25;
    
    // Contiene mayúsculas
    if (/[A-Z]/.test(this.password)) strength += 25;
    
    // Contiene números
    if (/[0-9]/.test(this.password)) strength += 25;
    
    // Contiene caracteres especiales
    if (/[^A-Za-z0-9]/.test(this.password)) strength += 25;
    
    return Math.min(strength, 100);
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    
    if (strength === 0) return 'Ninguna';
    if (strength <= 25) return 'Débil';
    if (strength <= 50) return 'Regular';
    if (strength <= 75) return 'Fuerte';
    return 'Excelente';
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    
    if (strength <= 25) return '#ef4444'; // Rojo
    if (strength <= 50) return '#f59e0b'; // Amarillo
    if (strength <= 75) return '#3b82f6'; // Azul
    return '#10b981'; // Verde
  }

  // Validar formulario completo
  validarFormulario(): boolean {
    this.errorMessage = '';

    // Campos REQUERIDOS según AuthDTO.RegisterRequest
    if (!this.nombre.trim()) {
      this.errorMessage = 'El nombre es obligatorio';
      return false;
    }

    if (!this.apellido.trim()) {
      this.errorMessage = 'El apellido es obligatorio';
      return false;
    }

    if (!this.correo.trim()) {
      this.errorMessage = 'El correo es obligatorio';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.correo)) {
      this.errorMessage = 'Ingresa un correo válido (ejemplo: usuario@correo.com)';
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

    // ✅ TELÉFONO: 9 DÍGITOS EXACTOS
    if (!this.telefono || !this.validarTelefono()) {
      this.errorMessage = 'El teléfono debe tener 9 dígitos (ej: 123456789)';
      return false;
    }

    if (!this.direccion || this.direccion.trim().length === 0) {
      this.errorMessage = 'La dirección es obligatoria';
      return false;
    }

    // Validar rol
    if (!this.rol || (this.rol !== 'PACIENTE' && this.rol !== 'MEDICO')) {
      this.errorMessage = 'Debes seleccionar un tipo de cuenta (Paciente o Médico)';
      return false;
    }

    return true;
  }

  // Método para registrar
  onSubmit(): void {
    console.log('🔄 Iniciando proceso de registro...');
    
    if (!this.validarFormulario()) {
      console.log('❌ Validación fallida:', this.errorMessage);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Datos EXACTAMENTE como los espera AuthDTO.RegisterRequest
    const registerData = {
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      correo: this.correo.trim().toLowerCase(),
      password: this.password,
      telefono: this.telefono.trim(),
      direccion: this.direccion.trim()
      // NOTA: El rol se maneja en el endpoint (/paciente o /medico)
      // Los campos dni, fechaNacimiento y genero son opcionales y no se envían
    };

    console.log('📤 Datos a enviar al backend:', registerData);
    console.log('📤 Rol seleccionado:', this.rol);

    // Determinar la ruta según el rol
    let endpoint = '';
    if (this.rol === 'PACIENTE') {
      endpoint = '/register/paciente';
    } else if (this.rol === 'MEDICO') {
      endpoint = '/register/medico';
    } else {
      this.errorMessage = 'Rol no válido para registro';
      this.isLoading = false;
      return;
    }

    const url = `${this.apiUrl}${endpoint}`;
    console.log('🔗 URL completa:', url);

    // Configurar headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // Enviar petición
    this.http.post<any>(url, registerData, { headers }).subscribe({
      next: (response) => {
        console.log('✅ Respuesta exitosa del servidor:', response);
        
        // Manejo de diferentes formatos de respuesta
        if (response.token || response.accessToken) {
          const token = response.token || response.accessToken;
          this.successMessage = '¡Registro exitoso! Redirigiendo al login...';
          
          // Guardar token si está disponible
          if (token) {
            localStorage.setItem('auth_token', token);
          }
          
          // Guardar usuario si está disponible
          if (response.usuario) {
            localStorage.setItem('auth_usuario', JSON.stringify(response.usuario));
          } else if (response.user) {
            localStorage.setItem('auth_usuario', JSON.stringify(response.user));
          } else if (response.usuarioResponse) {
            localStorage.setItem('auth_usuario', JSON.stringify(response.usuarioResponse));
          }
          
          // Esperar 2 segundos y redirigir al login
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else if (response.message) {
          // Si solo hay un mensaje de éxito
          this.successMessage = response.message + '. Redirigiendo al login...';
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = 'Respuesta inesperada del servidor';
          console.error('Respuesta inesperada:', response);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error en la solicitud:', error);
        
        // Manejo detallado de errores
        if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar al servidor. Verifica que Spring Boot esté corriendo en localhost:8080';
        } 
        else if (error.status === 400) {
          if (error.error && error.error.message) {
            this.errorMessage = `Error de validación: ${error.error.message}`;
          } else if (error.error && error.error.error) {
            this.errorMessage = `Error: ${error.error.error}`;
          } else {
            this.errorMessage = 'Datos inválidos. Verifica que todos los campos sean correctos.';
          }
        }
        else if (error.status === 409) {
          this.errorMessage = 'Este correo ya está registrado en el sistema.';
        }
        else if (error.status === 500) {
          this.errorMessage = 'Error interno del servidor. Contacta al administrador.';
        }
        else {
          this.errorMessage = `Error ${error.status}: ${error.statusText || 'Error desconocido'}`;
        }
        
        // Mostrar detalles del error
        console.error('=== DETALLES DEL ERROR ===');
        console.log('Status:', error.status);
        console.log('Status Text:', error.statusText);
        console.log('Error object:', error.error);
        console.log('============================');
        
        this.isLoading = false;
      }
    });
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

  // Calcular fechas para fecha de nacimiento (opcional)
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

  // ✅ MÉTODO ADICIONAL: Validar fecha de nacimiento
  validarFechaNacimiento(): boolean {
    if (!this.fechaNacimiento) return true; // Es opcional
    
    const fechaNac = new Date(this.fechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    // Debe ser mayor de 18 años
    if (edad < 18 || (edad === 18 && mes < 0)) {
      return false;
    }
    
    // No puede nacer en el futuro
    if (fechaNac > hoy) {
      return false;
    }
    
    // No puede tener más de 100 años
    if (edad > 100) {
      return false;
    }
    
    return true;
  }
}