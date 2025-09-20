import { Routes } from '@angular/router';
import { ClienteListComponent } from './features/cliente/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './features/cliente/cliente-form/cliente-form.component';
import { CuentaListComponent } from './features/cuenta/cuenta-list/cuenta-list.component';
import { CuentaFormComponent } from './features/cuenta/cuenta-form/cuenta-form.component';
import { MovimientoListComponent } from './features/movimiento/movimiento-list/movimiento-list.component';
import { MovimientoFormComponent } from './features/movimiento/movimiento-form/movimiento-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  { path: 'clientes', component: ClienteListComponent },
  { path: 'clientes/new', component: ClienteFormComponent },
  { path: 'clientes/edit/:id', component: ClienteFormComponent },
  { path: 'clientes/:id', component: ClienteFormComponent },
  { path: 'cuentas', component: CuentaListComponent },
  { path: 'cuentas/new', component: CuentaFormComponent },
  { path: 'cuentas/edit/:id', component: CuentaFormComponent },
  { path: 'cuentas/:id', component: CuentaFormComponent },
  { path: 'movimientos', component: MovimientoListComponent },
  { path: 'movimientos/new', component: MovimientoFormComponent },
  { path: 'movimientos/edit/:id', component: MovimientoFormComponent },
  { path: 'movimientos/:id', component: MovimientoFormComponent }
];
