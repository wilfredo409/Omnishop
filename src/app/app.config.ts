import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter }       from '@angular/router';
import { provideHttpClient }   from '@angular/common/http';

import { routes } from './app.routes';

/**
 * Configuración principal de la aplicación Angular.
 * Se registran los providers globales: router, HTTP client y detección de cambios.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};
