export interface NewCredito {
  idCliente: number;
  monto: number;
  semanas: number;
  horarioEntrega: string;
  atrasos?: number;
  recargos?: number;
}