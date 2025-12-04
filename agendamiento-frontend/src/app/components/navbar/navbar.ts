// src/app/components/navbar/navbar.ts
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  
  constructor(private router: Router) {}
  
  // Método para ir al home al hacer clic en el logo
  irAHome(): void {
    this.router.navigate(['/home']);
  }
}