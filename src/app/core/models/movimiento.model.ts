export interface Movimiento {
  id?: number;
  fecha: string; 
  tipoMovimiento: number; 
  valor: number;
  saldo: number; 
  cuentaId: number;
  cuenta?: Cuenta; 
}

export interface TipoMovimiento {
  value: number;
  label: string;
}

export interface MovimientoReporte {
  Fecha: string;
  Cliente: string;
  NumeroCuenta: string;
  Tipo: string;
  SaldoInicial: number;
  Estado: boolean;
  Movimiento: number;
  SaldoDisponible: number;
}

import { Cuenta } from './cuenta.model';