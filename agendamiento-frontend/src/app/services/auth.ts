import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Interfaces necesarias
export interface Usuario {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  nombreCompleto?: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  
  // Métodos para localStorage (seguros para SSR)
  private getStorage(): Storage | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage;
    }
    return null;
  }
  
  // Método para login (simulado - debes conectarlo a tu backend)
  login(email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      // Simulación de login - reemplaza con llamada HTTP real
      setTimeout(() => {
        if (email && password) {
          const usuario: Usuario = {
            id: 1,
            username: email.split('@')[0],
            email: email,
            nombre: 'Usuario',
            apellido: 'Demo',
            rol: 'PACIENTE',
            nombreCompleto: 'Usuario Demo'
          };
          
          const response: AuthResponse = {
            token: 'fake-jwt-token-' + Date.now(),
            usuario: usuario
          };
          
          this.guardarToken(response.token);
          this.guardarUsuario(response.usuario);
          resolve(response);
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 1000);
    });
  }
  
  // Métodos para manejar token
  guardarToken(token: string): void {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem('auth_token', token);
    }
  }
  
  obtenerToken(): string | null {
    const storage = this.getStorage();
    return storage ? storage.getItem('auth_token') : null;
  }
  
  eliminarToken(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem('auth_token');
    }
  }
  
  // Métodos para manejar usuario
  guardarUsuario(usuario: Usuario): void {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem('auth_usuario', JSON.stringify(usuario));
    }
  }
  
  obtenerUsuario(): Usuario | null {
    const storage = this.getStorage();
    if (storage) {
      const usuarioStr = storage.getItem('auth_usuario');
      return usuarioStr ? JSON.parse(usuarioStr) : null;
    }
    return null;
  }
  
  eliminarUsuario(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem('auth_usuario');
    }
  }
  
  // Verificación de autenticación
  estaAutenticado(): boolean {
    const token = this.obtenerToken();
    return token !== null && token !== '';
  }
  
  // Verificación de rol
  esAdministrador(): boolean {
    const usuario = this.obtenerUsuario();
    return usuario?.rol === 'ADMIN';
  }
  
  esMedico(): boolean {
    const usuario = this.obtenerUsuario();
    return usuario?.rol === 'MEDICO';
  }
  
  esPaciente(): boolean {
    const usuario = this.obtenerUsuario();
    return usuario?.rol === 'PACIENTE';
  }
  
  // Cerrar sesión
  cerrarSesion(): void {
    this.eliminarToken();
    this.eliminarUsuario();
  }
}