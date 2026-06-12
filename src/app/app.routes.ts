import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

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
    path: 'post-gig',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/post-gig/post-gig.component').then(m => m.PostGigComponent)
  },
  {
    path: 'my-gigs',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/my-gigs/my-gigs.component').then(m => m.MyGigsComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent)
  },
  {
    path: 'leaderboard',
    loadComponent: () =>
      import('./pages/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent)
  },
  {
    path: 'saved-gigs',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/saved-gigs/saved-gigs.component').then(m => m.SavedGigsComponent)
  },
  {
    path: 'onboarding',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/onboarding/onboarding.component').then(m => m.OnboardingComponent)
  },
  {
    path: 'chat/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/chat/chat.component').then(m => m.ChatComponent)
  },
  {
    path: 'referral',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/referral/referral.component').then(m => m.ReferralComponent)
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
