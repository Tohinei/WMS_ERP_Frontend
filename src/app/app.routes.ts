import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { UserListComponent } from './shared/components/user-list/user-list.component';
import { RoleListComponent } from './shared/components/role-list/role-list.component';
import { MenuListComponent } from './shared/components/menu-list/menu-list.component';
import { SessionListComponent } from './shared/components/session-list/session-list.component';
import { HasNoAccessComponent } from './pages/has-no-access/has-no-access.component';

export const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'dashboard/user-management', component: UserListComponent },
  { path: 'dashboard/role-management', component: RoleListComponent },
  { path: 'dashboard/menu-management', component: MenuListComponent },
  { path: 'dashboard/session-management', component: SessionListComponent },
  { path: 'hasNoAcess', component: HasNoAccessComponent },
  { path: '**', component: NotFoundComponent },
];

export const appConfig = [provideRouter(routes)];
