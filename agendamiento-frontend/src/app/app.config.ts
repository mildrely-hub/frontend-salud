import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';

// 1. AGREGAR: Importar el interceptor
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ✅ CORRECTO para Angular 18+ con SSR
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    provideRouter(routes),
    provideClientHydration(),
    
    // 2. AGREGAR: Modificar esta línea para incluir withInterceptors
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])  // AGREGADO: Solo esto
    )
  ]
};