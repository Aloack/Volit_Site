import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import path from 'path';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: 'home', loadComponent: () => import('./pages/home/home/home.component').then(m => m.HomeComponent),
        children: [
          {
            path: '', // Rota padrão do home
            loadComponent:() => import('./pages/home/homePages/home-content/home-content.component').then(m => m.HomeContentComponent)
          },
          {
            path: 'contact', // Sub-rota 'other' dentro de home
            loadComponent: () => import('./pages/content/contact/contact.component').then(m => m.ContactComponent)
          }
        ]
      },
      { path: '**', redirectTo: 'home' }
    ])
  ]
};