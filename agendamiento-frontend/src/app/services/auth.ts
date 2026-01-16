import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api';

// Interfaces que coinciden con el backend
export interface LoginRequest {
  correo: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  telefono: string;
  direccion?: string;
  rol?: string;
}

export interface UsuarioResponse {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion?: string;
  rol: string;
  nombreCompleto: string;
}

export interface AuthResponse {
  token: string;
  tipoToken: string;
  usuario: UsuarioResponse;
  expiracion: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  timestamp: number;
}

export interface SuccessResponse {
  message: string;
  timestamp: number;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion?: string;
  rol: string;
  nombreCompleto: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // ========== MÉTODOS DE AUTENTICACIÓN ==========
  
  login(correo: string, password: string): Observable<AuthResponse> {
    const body: LoginRequest = { correo, password };
    console.log('Enviando login:', body);
    
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, body);
  }

  registerPaciente(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register/paciente`, data);
  }

  registerMedico(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register/medico`, data);
  }

  verifyToken(token: string): Observable<SuccessResponse | ErrorResponse> {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<SuccessResponse | ErrorResponse>(`${API_URL}/auth/verify`, { headers });
  }

  // ========== MÉTODOS DE GESTIÓN DE SESIÓN ==========
  
  guardarUsuario(usuario: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  obtenerUsuario(): Usuario | null {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      try {
        return JSON.parse(usuarioStr) as Usuario;
      } catch (e) {
        console.error('Error parsing usuario:', e);
        return null;
      }
    }
    return null;
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }

  estaAutenticado(): boolean {
    const token = this.obtenerToken();
    const usuario = this.obtenerUsuario();
    return !!token && !!usuario;
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

  getAuthHeaders(): { [header: string]: string } {
    const token = this.obtenerToken();
    const headers: { [header: string]: string } = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }
}