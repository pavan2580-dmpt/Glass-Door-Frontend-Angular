import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'sales-products',
    loadComponent: () =>
      import('./components/sales-products/sales-products.component').then(
        (mod) => mod.ProductListComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'product-bills',
    loadComponent: () =>
      import('./components/product-bills/product-bills.component').then(
        (mod) => mod.ProductBillsComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'create-bills',
    loadComponent: () =>
      import(
        './components/product-bills/create-bill/create-bill.component'
      ).then((mod) => mod.CreateBillComponent),
    canActivate: [authGuard],
  },
  {
    path: 'filter-list/:id',
    loadComponent: () =>
      import('./components/product-bills/filter-list/filter-list.component').then(
        (mod) => mod.FilterListComponent
      ),
    canActivate: [authGuard],
  },

  {
    path: 'bill-print/:id',
    loadComponent: () =>
      import('./components/product-bills/bill-print/bill-print.component').then(
        (mod) => mod.BillPrintComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'purchase-products',
    loadComponent: () =>
      import('./components/purchase-products/purchase-products.component').then(
        (mod) => mod.PurchaseProductsComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (c) => c.LoginComponent
      ),
    pathMatch: 'full',
  },
];
