export interface Cliente {
  idCliente: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  edad: number;
  domicilio: string;
  colonia: string;
  ciudad: string;
  telefono: string;
  clasificacion: string;
  tipoCliente: string;
  puntos: number;
  trabajo: string; 
  domicilioTrabajo: string;
  telefonoTrabajo: string;
  nombreReferencia: string;
  domicilioReferencia: string;
  telefonoReferencia: string;
  codigoZona: string;
  promotora: string;
}

export interface Aval {
  idAval: number;
  idCliente: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  edad: number;
  domicilio: string;
  telefono: string;
  trabajo: string;
  domicilioTrabajo: string;
  telefonoTrabajo: string;
}

export interface GarantiaCliente {
  idGarantia: number;
  idCliente: number;
  descripcion: string;
}

export interface GarantiaAval {
  idGarantia: number;
  idAval: number;
  descripcion: string;
}
export interface credito{
  abonoSemanal: number;
  idCredito: number;
  monto: number;
}
export interface pagos{
  fechaEsperada: Date;
}

export interface ClienteCollector{
  cliente: Cliente;
  avales: Aval[];
  garantiasCliente: GarantiaCliente[];
  garantiasAval: GarantiaAval[];
  credito: credito;
  pagos: pagos[];
}