import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ProductsListComponent } from './features/products/products-list/products-list.component';
import { SalesDashboardComponent } from './features/sales/sales-dashboard/sales-dashboard.component';
import { ClientsListComponent } from './features/clients/clients-list/clients-list.component';
import { UsersListComponent } from './features/users/users-list/users-list.component';
import { CategoriesListComponent } from './features/categories/categories-list/categories-list.component';
import { CortesCarteraComponent } from './features/reports/cortes-cartera/cortes-cartera.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'products',
    component: ProductsListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'sales',
    component: SalesDashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'clients',
    component: ClientsListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'users',
    component: UsersListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'categories',
    component: CategoriesListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'cortes',
    component: CortesCarteraComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
