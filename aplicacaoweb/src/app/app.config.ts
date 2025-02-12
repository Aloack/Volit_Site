import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import path from 'path';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: 'home', loadComponent: () => import('./pages/home/home/home.component').then(m => m.HomeComponent)},
      { path: '**', redirectTo: 'home' }
    ])
  ]
};