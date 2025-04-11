export interface Cliente {
    idCliente: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    domicilio: string;
    telefono: string;
    clasificacion: string;
    tipoCliente: string; // Si tienes esta propiedad en la base de datos
  }
  
  export interface Credito {
    monto: number;
    fechaEntrega: string; // O 'Date', si prefieres trabajar con objetos Date
  }
  
  export interface Pago {
    numeroSemana: number;
    cantidad: number;
  }
  
  export interface NewCredit {
    cliente: Cliente;
    credito: Credito;
    pagos: Pago[];
  }