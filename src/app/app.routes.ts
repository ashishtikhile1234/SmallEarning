import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'browse',
    loadComponent: () =>
      import('./pages/browse/browse.component').then(m => m.BrowseComponent)
  },
  {
    path: 'gig/:id',
    loadComponent: () =>
      import('./pages/gig-detail/gig-detail.component').then(m => m.GigDetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
