// src/app/services/auth.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// Interfaces
export interface Usuario {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  tipo_usuario?: string;
  nombreCompleto?: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
  success?: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:8080';
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}
  
  // Método para login - CORREGIDO según tu AuthController
  login(email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      const loginData = {
        email: email,
        password: password
      };

      // Usa la ruta correcta según tu AuthController
      this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, loginData)
        .subscribe({
          next: (response) => {
            if (response.token && response.usuario) {
              this.guardarToken(response.token);
              this.guardarUsuario(response.usuario);
              resolve(response);
            } else {
              reject(new Error('Credenciales inválidas'));
            }
          },
          error: (error) => {
            if (error.status === 401) {
              reject(new Error('Email o contraseña incorrectos'));
            } else if (error.status === 0) {
              reject(new Error('No se pudo conectar al servidor'));
            } else {
              reject(new Error(error.error?.message || 'Error en el servidor'));
            }
          }
        });
    });
  }
  
  // Métodos de almacenamiento
  private getStorage(): Storage | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage;
    }
    return null;
  }
  
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
  
  estaAutenticado(): boolean {
    const token = this.obtenerToken();
    return token !== null && token !== '';
  }
  
  esAdministrador(): boolean {
    const usuario = this.obtenerUsuario();
    return usuario?.rol === 'ADMINISTRADOR';
  }
  
  esMedico(): boolean {
    const usuario = this.obtenerUsuario();
    return usuario?.rol === 'MEDICO';
  }
  
  esPaciente(): boolean {
    const usuario = this.obtenerUsuario();
    return usuario?.rol === 'PACIENTE';
  }
  
  cerrarSesion(): void {
    this.eliminarToken();
    this.eliminarUsuario();
  }
}