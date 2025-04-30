export interface ClienteConDatos {
  cliente: Cliente;
  credito?: Credito;
  pagos?: Pago[];
}

export interface Cliente {
  id: number;
  nombreCompleto: string;
  telefono?: string;
  direccion?: string;
  // Agrega otros campos que tengas en tu tabla cliente
}

export interface Credito {
  monto: number;
  semanas: number;
  fechaEntrega?: string;
  abonoSemanal?: number;
  cumplimiento?: string;
  // Agrega cualquier otro campo que incluya tu respuesta de crédito
}

export interface Pago {
  numeroSemana: number;
  fechaPago: string;
  montoPagado: number;
  estado: string;
  // Agrega más si tu backend manda otros datos por pago
}