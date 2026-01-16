import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// IMPORTANTE: Cambia esta ruta según tu estructura real
import { NavbarComponent } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class App implements OnInit {
  ngOnInit(): void {
    console.log('Aplicación MJ Salud iniciada');
  }
}