export interface Cliente {
  id?: number;
  clienteId: string;
  nombre: string;
  genero: number;
  edad: number;
  numeroIdentificacion: string;
  tipoIdentificacion: string;
  direccion: string;
  telefono: string;
  contrasena: string;
  estado: boolean;
}

export interface Genero {
  value: number;
  label: string;
}