export interface ClienteConDatos {
  cliente: Cliente;
  credito?: Credito;
  pagos?: Pagos[];
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
  fechaEntrega: string;
  idCredito: string;
  monto: string;
}
 
export interface Pagos {

  numeroSemana: string;
  cantidad: number;
  estado: number;

}