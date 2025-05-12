import { Component } from '@angular/core';
import { PrintButtonComponent } from "../../shared/componentes/print-button/print-button.component";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SearchBarComponent } from '../../shared/componentes/search-bar-client/search-bar.component';
import { ClienteCollector,  Aval, GarantiaCliente, GarantiaAval } from '../../models/ClienteCollector';
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
  clienteParaImprimir!: ClienteCollector;



  asignarDatos(respuesta: any) {
    console.log('Asignar datos:', respuesta);
    
  const collector: Collector = {
    name: respuesta.cliente.nombre + ' ' + respuesta.cliente.apellidoPaterno + ' ' + respuesta.cliente.apellidoMaterno,
    address: respuesta.cliente.domicilio,
    phone: respuesta.cliente.telefono,
    guarantorp: respuesta.avales?.[0]?.nombre + ' ' + respuesta.avales?.[0]?.apellidoPaterno + ' ' + respuesta.avales?.[0]?.apellidoMaterno,
    guarantors: respuesta.avales?.[1] ? `${respuesta.avales[1].nombre} ${respuesta.avales[1].apellidoPaterno} ${respuesta.avales[1].apellidoMaterno}`: ''
  };
  this.clienteParaImprimir = respuesta as ClienteCollector;

  this.dataCollector.data = [collector];
  }
imprimirCliente() {
  if (!this.clienteParaImprimir) {
    console.warn('No hay cliente para imprimir');
    return;
  }
  const c = this.clienteParaImprimir;
  const doc = new jsPDF();
  const fecha = new Date().toLocaleDateString();
  const logo = new Image();
  logo.src = '/logo.jpg';

  logo.onload = () => {
    // === Encabezado ===
    doc.addImage(logo, 'JPEG', 10, 10, 20, 20);
    doc.setFontSize(16);
    doc.text('Recopiladores', 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Fecha: ${fecha}`, 200, 10, { align: 'right' });

    let y = 35;
    const lh = 6;

    const seccion = (titulo: string) => {
      doc.setFillColor(220, 220, 220);  // Color gris
      doc.rect(10, y, 190, 8, 'F');
      doc.setTextColor(0);
      doc.setFontSize(12);
      doc.text(titulo, 12, y + 6);
      y += 10;

      // Línea horizontal sutil bajo el título
      doc.setDrawColor(180);
      doc.line(10, y - 2, 200, y - 2);

      y += 2; // Espacio adicional bajo línea
    };

    // === DATOS CLIENTE ===
    seccion('Datos del Cliente');
    const cliente = c.cliente;

    const fila1 = [
      `Nombre: ${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
      `Domicilio: ${cliente.domicilio}`,
      `Ciudad: ${cliente.ciudad}`
    ];
    const fila2 = [
      `Colonia: ${cliente.colonia}`,
      `Teléfono: ${cliente.telefono}`,
      `Clasificación: ${cliente.clasificacion}`
    ];
    const fila3 = [
      `Edad: ${cliente.edad}`,
      `Tipo Cliente: ${cliente.tipoCliente}`,
      `Puntos: ${cliente.puntos}`
    ];
    const fila4 = [
      `Trabajo: ${cliente.trabajo}`,
      `Domicilio Trabajo: ${cliente.domicilioTrabajo}`,
      `Teléfono Trabajo: ${cliente.telefonoTrabajo}`
    ];
    const fila5 = [
      `Referencia: ${cliente.nombreReferencia}`,
      `Domicilio Ref.: ${cliente.domicilioReferencia}`,
      `Teléfono Ref.: ${cliente.telefonoReferencia}`
    ];

    [fila1, fila2, fila3, fila4, fila5].forEach(fila => {
      doc.setFontSize(10);
      doc.text(fila[0], 12, y);
      doc.text(fila[1], 90, y);
      doc.text(fila[2], 150, y);
      y += lh;
    });

    y += 4;

    // === GARANTÍAS CLIENTE ===
    seccion('Garantías del Cliente');

    if (c.garantiasCliente.length > 0) {
      c.garantiasCliente.forEach(g => {
        doc.setFontSize(10);  // Aseguramos que el tamaño sea igual al de la información
        doc.text(`• ${g.descripcion}`, 15, y);
        y += lh;
      });
    } else {
      doc.text('No disponible', 15, y);
      y += lh;
    }

    y += 4;

    // === AVALES ===
    seccion('Avales');

    const avales = c.avales;
    const avalesPorColumna = 2;
    const columnaX = [15, 105]; // Columnas para los avales
    let yAvales = y; // Guardamos y inicial

    // Si hay un solo aval
    if (avales.length === 1) {
      const aval = avales[0];
      doc.setFontSize(11);
      doc.text(`Aval 1: ${aval.nombre} ${aval.apellidoPaterno} ${aval.apellidoMaterno}`, 15, yAvales);
      yAvales += lh;

      const datosAval = [
        `Domicilio: ${aval.domicilio}`,
        `Teléfono: ${aval.telefono}`,
        `Edad: ${aval.edad}`,
        `Trabajo: ${aval.trabajo}`,
        `Domicilio Trabajo: ${aval.domicilioTrabajo}`,
        `Tel. Trabajo: ${aval.telefonoTrabajo}`
      ];

      datosAval.forEach(line => {
        doc.setFontSize(10);
        doc.text(line, 20, yAvales);
        yAvales += lh;
      });

      // === GARANTÍAS DEL AVAL ===
      doc.setFontSize(12);
      doc.setFillColor(220, 220, 220);  // Color gris para el título
      doc.rect(10, yAvales, 190, 8, 'F');
      doc.setTextColor(0);
      doc.text('Garantías del Aval:', 12, yAvales + 6);
      yAvales += 10;

      // Línea horizontal sutil bajo el título
      doc.setDrawColor(180);
      doc.line(10, yAvales - 2, 200, yAvales - 2);
      yAvales += 2;

      const garantiasAval = c.garantiasAval.filter(g => g.idAval === aval.idAval);
      if (garantiasAval.length > 0) {
        garantiasAval.forEach(g => {
          doc.text(`• ${g.descripcion}`, 25, yAvales);
          yAvales += lh;
        });
      } else {
        doc.text('No disponible', 25, yAvales);
        yAvales += lh;
      }

      y = yAvales + 4; // Actualizamos la posición para la siguiente sección

    } else {
      // Si hay más de un aval, distribuir en dos columnas
      let maxY = yAvales;

      for (let i = 0; i < Math.min(avalesPorColumna, avales.length); i++) {
        const aval = avales[i];
        let x = columnaX[i]; // X variable para las dos columnas
        let yCol = yAvales;

        doc.setFontSize(11);
        doc.text(`Aval ${i + 1}: ${aval.nombre} ${aval.apellidoPaterno} ${aval.apellidoMaterno}`, x, yCol);
        yCol += lh;

        const datosAval = [
          `Domicilio: ${aval.domicilio}`,
          `Teléfono: ${aval.telefono}`,
          `Edad: ${aval.edad}`,
          `Trabajo: ${aval.trabajo}`,
          `Domicilio Trabajo: ${aval.domicilioTrabajo}`,
          `Tel. Trabajo: ${aval.telefonoTrabajo}`
        ];

        datosAval.forEach(line => {
          doc.setFontSize(10);
          doc.text(line, x + 5, yCol); // Ajustar el margen a la derecha
          yCol += lh;
        });

        // === GARANTÍAS DEL AVAL ===
        doc.setFontSize(12);
        doc.setFillColor(220, 220, 220);  // Color gris para el título
        doc.rect(x, yCol, 90, 8, 'F');
        doc.setTextColor(0);
        doc.text('Garantías del Aval:', x + 5, yCol + 6);
        yCol += 10;

        // Línea horizontal sutil bajo el título
        doc.setDrawColor(180);
        doc.line(x, yCol - 2, x + 90, yCol - 2);
        yCol += 2;

        const garantiasAval = c.garantiasAval.filter(g => g.idAval === aval.idAval);
        if (garantiasAval.length > 0) {
          garantiasAval.forEach(g => {
            doc.text(`• ${g.descripcion}`, x + 10, yCol);
            yCol += lh;
          });
        } else {
          doc.text('No disponible', x + 10, yCol);
          yCol += lh;
        }

        maxY = Math.max(maxY, yCol); // Actualizamos la altura máxima para asegurar que no se desborde
      }

      y = maxY + 4; // Espacio final después de los avales
    }

    doc.save(`${cliente.nombre}.pdf`);
  };
}



} 
