import { Component } from '@angular/core';
import { PrintButtonComponent } from "../../shared/componentes/print-button/print-button.component";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SearchBarComponent } from '../../shared/componentes/search-bar-client/search-bar.component';
import { ClienteCollector } from '../../models/ClienteCollector';
import jsPDF from 'jspdf';

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
  this.clienteParaImprimir = respuesta;
  this.dataCollector.data = [collector];
  }
  imprimirCliente() {
  console.log('Cliente a imprimir', this.clienteParaImprimir);

  if (!this.clienteParaImprimir) {
    console.warn('No hay cliente para imprimir');
    return;
  }

  const c = this.clienteParaImprimir;

  const nombre = `${c.cliente?.nombre || ''} ${c.cliente?.apellidoPaterno || ''} ${c.cliente?.apellidoMaterno || ''}`;
  const direccion = c.cliente?.domicilio || 'No disponible';
  const telefono = c.cliente?.telefono || 'No disponible';

  const avalPrincipal = c.avales?.[0]
    ? `${c.avales[0].nombre} ${c.avales[0].apellidoPaterno} ${c.avales[0].apellidoMaterno}`
    : 'No disponible';

  const avalSecundario = c.avales?.[1]
    ? `${c.avales[1].nombre} ${c.avales[1].apellidoPaterno} ${c.avales[1].apellidoMaterno}`
    : 'No disponible';

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Información del Cliente', 20, 20);

  doc.setFontSize(12);
  doc.text(`Nombre: ${nombre}`, 20, 40);
  doc.text(`Dirección: ${direccion}`, 20, 50);
  doc.text(`Teléfono: ${telefono}`, 20, 60);
  doc.text(`Aval Principal: ${avalPrincipal}`, 20, 70);
  doc.text(`Aval Secundario: ${avalSecundario}`, 20, 80);

  doc.save('cliente.pdf');
}


} 
