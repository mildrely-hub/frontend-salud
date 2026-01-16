import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // ✅ CORRECTO para Angular 18+ con SSR
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch())
  ]
};