import { Component, Input, SimpleChanges} from '@angular/core';
import jsPDF from 'jspdf';
import dayjs from 'dayjs';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrl: './print.component.css',
  imports: []
})
export class PrintComponent {
  @Input() datos: any;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos'] && this.datos) {
      console.log('Datos en print:', this.datos);
      this.imprimirCreditoFormato();
    }
  }
  imprimirCreditoFormato() {
  if (!this.datos) {
    console.warn('No hay datos de cliente para imprimir');
    return;
  }
  const c = this.datos;
  const i = c.imprimir || c.imprimir;
  const cliente = i.cliente || i.clientes;
  const credito = i.credito || i.creditos;
  const pagos = i.pagos || {}; 
  const zona = i.zona || {};
  const semanasRestantes = c.semanasRestantes;
  const abonoAnterior = c.abonoAnterior;
  const descuentoSemanas = c.descuentoSemanas;
  //hoja ofcio
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [216, 330]
  });
  const colorResalte: [number, number, number] = [210, 255, 210];
  const renderContenido = (offsetY: number) => {
  const fechaHoy = dayjs().format('DD/MM/YYYY');
  const nombreCompleto = `${cliente?.nombre} ${cliente?.apellidoPaterno} ${cliente?.apellidoMaterno}`.toUpperCase();
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FORMATO DE CREDITO FINANCIERA CRECEX', 105, 20 + offsetY, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`FECHA: ${fechaHoy}`, 90, 35 + offsetY);
    doc.text(`HORARIO DE ENTREGA: ${credito?.horarioEntrega || 'N/A'}`, 135, 35 + offsetY);
    doc.text(`CODIGO:${credito.id || 'N/A'}`, 135, 45 + offsetY);
    doc.text(`SECCIÓN: ${zona.codigoZona || '-'}`, 10, 35 + offsetY);
    doc.text(`PROMOTORA: ${zona.promotora || '-'}`, 90, 45 + offsetY);
    doc.setFont('helvetica', 'bold');
    doc.text(`CLIENTE: ${nombreCompleto}`, 10, 45 + offsetY);

    let y = 60 + offsetY;
    const salto = 8;
    const fontSize = 10;
    const imprimirPar = (
      label1: string, val1: string | number, resaltar1: boolean,
      label2: string, val2: string | number, resaltar2: boolean,
    ) => {doc.setFontSize(fontSize);doc.setTextColor(0);

      // Izquierda
      doc.setFont('helvetica', resaltar1 ? 'bold' : 'normal');
      doc.text(`${label1}:`, 12, y);
      if (resaltar1) {
        doc.setFillColor(...colorResalte);
        doc.rect(55, y - 5.5, 45, 7, 'F');
      }
      doc.text(`${val1}`, 70, y);
      // Derecha
      doc.setFont('helvetica', resaltar2 ? 'bold' : 'normal');
      doc.text(`${label2}:`, 110, y);
      if (resaltar2) {
        doc.setFillColor(...colorResalte);
        doc.rect(155, y - 5.5, 45, 7, 'F');
      }
      doc.text(`${val2}`, 158, y);
      y += salto;
    };

    const deduccionTotal   = descuentoSemanas+ credito.atrasos + credito.recargos;
    const fechaPrimerPago = pagos?.fechaEsperada
    ? dayjs(pagos.fechaEsperada).format('DD/MM/YYYY'): 'N/A';
    imprimirPar('TIPO DE CREDITO', credito?.tipoCredito || 'N/A', false,
            'MONTO', `$${(credito?.monto ?? 0).toLocaleString('en-US')}`, true);
    imprimirPar('ABONO SEMANAL ANTERIOR', `$${(abonoAnterior ?? 0).toLocaleString('en-US')}`, false,
            'SEMANAS RESTANTES', `${(semanasRestantes ?? 0).toLocaleString('en-US')}`, false);
    imprimirPar('DEDUCCION DE SEMANAS', `$${(descuentoSemanas ?? 0).toLocaleString('en-US')}`, false,
            'ATRASOS', `$${(credito?.atrasos ?? 0).toLocaleString('en-US')}`, false);
    imprimirPar('RECARGOS', `$${(credito?.recargos ?? 0).toLocaleString('en-US')}`, false,
            'DED. TOTALES', `$${(deduccionTotal ?? 0).toLocaleString('en-US')}`, false);
    imprimirPar('CRÉDITO A ENTREGAR', `$${(credito?.efectivo ?? 0).toLocaleString('en-US')}`, true,
            'SEMANAS CREDITO', `${credito?.semanas ?? 0} semanas`, false);
    imprimirPar('ABONO SEMANAL', `$${(credito?.abonoSemanal ?? 0).toLocaleString('en-US')}`, true,
            'FECHA PRIMER PAGO', fechaPrimerPago, true);
    y += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('ENTREGÓ:', 10, y);
    doc.line(40, y - 1.5, 100, y - 1.5);
    doc.text('RECIBÍ:', 120, y);
    doc.line(150, y - 1.5, 195, y - 1.5);
  };

  const logo = new Image();
  logo.src = '/logo.jpg';                                        
  logo.onload = () => {
    doc.addImage(logo, 'JPEG', 8, 1, 20, 20);
    renderContenido(-10);
    doc.addImage(logo, 'JPEG', 8, 170, 20, 20);
    renderContenido(160); 
    doc.save(`${cliente?.nombre || 'cliente'}_Credito.pdf`);
  };
  logo.onerror = () => {
    console.warn('No se cargó logo, se genera sin imagen');
    renderContenido(0);
    renderContenido(180);
    doc.save(`${cliente?.nombre || 'cliente'}_Credito.pdf`);
  };
}
}