import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen.html',
  styleUrls: ['./resumen.css']
})
export class AdminComponent implements OnInit {
  
  usuario: any = null;
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('usuario');

    if (!token || !userJson) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuario = JSON.parse(userJson);

    // Verificamos que sea ADMIN
    if (this.usuario.rol !== 'ADMINISTRADOR') {
      console.error('Acceso denegado: No es administrador');
      this.router.navigate(['/home']);
      return;
    }
  }
  
  salir(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}