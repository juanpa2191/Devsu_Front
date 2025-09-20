export interface Cuenta {
  id?: number;
  numeroCuenta: string;
  tipoCuenta: number; 
  saldoInicial: number;
  estado: boolean;
  clienteId: number;
  cliente?: Cliente; 
}

export interface TipoCuenta {
  value: number;
  label: string;
}

import { Cliente } from './cliente.model';