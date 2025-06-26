export interface ClienteConDatos {
  cliente: Cliente;
  credito?: Credito;
  pagos?: Pagos[];
  semanasPagadas?: number;
  totalDescontarSemanas?: number;
}
 
export interface Cliente {
  apellidoMaterno: string;
  apellidoPaterno: string;
  clasificacion: string;
  domicilio: string;
  idCliente: number;
  nombre: string;
  telefono: string;
  tipoCliente: string;
}

export interface Credito {
  idCredito: number;
  monto: number;
  fechaEntrega: string;
  semanas: number;         
  abonoSemanal: number;  
}
 
export interface Pagos {

  numeroSemana: number;
  cantidad: number;
  estado: number;

}