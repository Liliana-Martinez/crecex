import { Component } from '@angular/core';
import { PrintButtonComponent } from "../../shared/componentes/print-button/print-button.component";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SearchBarComponent } from '../../shared/componentes/search-bar-client/search-bar.component';
import { ClienteCollector } from '../../models/ClienteCollector';
export interface Collector {
  name: string;
  address: string;
  phone: string;
  guarantorp: string;
  guarantors: string;
}


@Component({
  selector: 'app-collectors',
  imports: [SearchBarComponent, PrintButtonComponent, MatTableModule],
  templateUrl: './collectors.component.html',
  styleUrl: './collectors.component.css'
})
export class CollectorsComponent {
  modulo: string = 'collectors';
  dataCollector = new MatTableDataSource<any>()
  collectorCol: string [] = ['name', 'address', 'phone', 'guarantorp', 'guarantors'];
  clienteParaImprimir: any;

  asignarDatos(respuesta: any) {
    console.log('Asignar datos:', respuesta);
  const collector: Collector = {
    name: respuesta.cliente.nombre + ' ' + respuesta.cliente.apellidoPaterno + ' ' + respuesta.cliente.apellidoMaterno,
    address: respuesta.cliente.domicilio,
    phone: respuesta.cliente.telefono,
    guarantorp: respuesta.avales?.[0]?.nombre + ' ' + respuesta.avales?.[0]?.apellidoPaterno + ' ' + respuesta.avales?.[0]?.apellidoMaterno,
    guarantors: respuesta.avales?.[1] ? `${respuesta.avales[1].nombre} ${respuesta.avales[1].apellidoPaterno} ${respuesta.avales[1].apellidoMaterno}`: ''
  };
  this.clienteParaImprimir = collector; // 👈 ¡esto es clave!
  console.log('Cliente asignado a imprimir:', this.clienteParaImprimir);
  this.dataCollector.data = [collector];
  }
  imprimirCliente() {
    console.log('Cliente a imprimir',this.clienteParaImprimir);
    if (!this.clienteParaImprimir) {
      console.warn('No hay cliente para imprimir');
      return;
    }

    const c = this.clienteParaImprimir;

    const contenido = `
      <h1>Información del Cliente</h1>
      <p><strong>Nombre:</strong> ${c.name}</p>
      <p><strong>Dirección:</strong> ${c.address}</p>
      <p><strong>Teléfono:</strong> ${c.phone}</p>
      <p><strong>Aval Principal:</strong> ${c.guarantorp}</p>
      <p><strong>Aval Secundario:</strong> ${c.guarantors}</p>
    `;

    const ventana = window.open('', '_blank');
    ventana!.document.write(`<html><head><title>Cliente</title></head><body>${contenido}</body></html>`);
    ventana!.document.close();
    ventana!.print();
  }
} 
