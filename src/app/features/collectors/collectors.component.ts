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
  
    const doc = new jsPDF();
    doc.setFontSize(12);
    let y = 10;
  
    const agregarTexto = (label: string, valor: any) => {
      const texto = `${label}: ${valor}`;
      const lineas = doc.splitTextToSize(texto, 180);
      doc.text(lineas, 10, y);
      y += lineas.length * 5;
    };
  
    const imprimirObjeto = (obj: any, titulo: string) => {
      if (!obj) return;
      doc.setFont('helvetica', 'bold');
      doc.text(`${titulo}`, 10, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value !== 'object') {
          agregarTexto(key, value);
        }
      }
    };
  
    const imprimirArray = (array: any[], titulo: string) => {
      if (!array || array.length === 0) return;
      doc.setFont('helvetica', 'bold');
      doc.text(`${titulo}`, 10, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      array.forEach((item, index) => {
        doc.text(`#${index + 1}`, 10, y);
        y += 5;
        const claves = Object.entries(item)
          .filter(([_, val]) => typeof val !== 'object')
          .map(([k, v]) => `${k}: ${v}`)
          .join(' | ');
        const lineas = doc.splitTextToSize(claves, 180);
        doc.text(lineas, 10, y);
        y += lineas.length * 5;
      });
    };
  
    const data = this.clienteParaImprimir;
  
    imprimirObjeto(data.cliente, 'Cliente');
    imprimirArray(data.avales, 'Avales');
    imprimirArray(data.garantiasCliente, 'Garantías del Cliente');
    imprimirArray(data.garantiasAval, 'Garantías de Avales');
  
    doc.save('cliente_compacto.pdf');
  }
  
  
  
  


} 
