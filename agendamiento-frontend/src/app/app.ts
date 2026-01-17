import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // SOLO RouterOutlet, sin NavbarComponent
  template: `
    <!-- ELIMINA <app-navbar></app-navbar> -->
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class App implements OnInit {
  ngOnInit(): void {
    console.log('Aplicación MJ Salud iniciada');
  }
}