import { Component, Input, SimpleChanges} from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PrintButtonComponent } from '../../../../shared/componentes/print-button/print-button.component';
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
  const pagos = i.pagos || [];
  const zona = i.zona || {};
  const doc = new jsPDF();

  const colorResalte: [number, number, number] = [210, 255, 210];

  const renderContenido = (offsetY: number) => {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FORMATO DE CREDITO FINANCIERA CRECEX', 105, 20 + offsetY, { align: 'center' });

    const fechaHoy = dayjs().format('DD/MM/YYYY');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`FECHA: ${fechaHoy}`, 100, 35 + offsetY);
    doc.text(`HORARIO: ${credito?.horarioEntrega || 'N/A'}`, 180, 35 + offsetY, { align: 'right' });

    doc.text(`SECCIÓN: ${zona.codigoZona || '-'}`, 10, 35 + offsetY);
    doc.text(`PROMOTORA: ${zona.promotora || '-'}`, 100, 45 + offsetY);

    const nombreCompleto = `${cliente?.nombre} ${cliente?.apellidoPaterno} ${cliente?.apellidoMaterno}`.toUpperCase();
    doc.setFont('helvetica', 'bold');
    doc.text(`CLIENTE: ${nombreCompleto}`, 10, 52 + offsetY);

    // Detalles en pares
    let y = 60 + offsetY;
    const salto = 8;
    const fontSize = 10;

    const imprimirPar = (
      label1: string, val1: string | number, resaltar1: boolean,
      label2: string, val2: string | number, resaltar2: boolean
    ) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(0);

      // Campo izquierdo
      doc.setFont('helvetica', resaltar1 ? 'bold' : 'normal');
      doc.text(`${label1}:`, 12, y);
      if (resaltar1) {
        doc.setFillColor(...colorResalte);
        doc.rect(55, y - 5.5, 40, 7, 'F');
      }
      doc.text(`${val1}`, 58, y);

      // Campo derecho
      doc.setFont('helvetica', resaltar2 ? 'bold' : 'normal');
      doc.text(`${label2}:`, 110, y);
      if (resaltar2) {
        doc.setFillColor(...colorResalte);
        doc.rect(155, y - 5.5, 40, 7, 'F');
      }
      doc.text(`${val2}`, 158, y);

      y += salto;
    };

    // Imprimir los pares
    imprimirPar('TIPO DE CREDITO', credito?.tipoCredito || 'N/A', false,
                'MONTO', `$${credito?.monto ?? 0}`, true);

    imprimirPar('ABONO SEMANAL ANT.', 'aún nada', false,
                'DED. SEM. RESTANTES', 'lógica no aplicada', false);

    imprimirPar('DED. SEM. TOTALES', 'lógica no aplicada', false,
                'ATRASOS', `$${credito?.atrasos ?? 0}`, false);

    imprimirPar('RECARGOS', `$${credito?.recargos ?? 0}`, false,
                'DED. TOTALES', 'lógica no aplicada', false);

    imprimirPar('CRÉDITO A ENTREGAR', `$${credito?.efectivo ?? 0}`, true,
                'SEMANAS CREDITO', `${credito?.semanas ?? 0} semanas`, false);

    imprimirPar('ABONO SEM. NUEVO', `$${credito?.abonoSemanal ?? 0}`, true,
                'FECHA 1er PAGO',
                pagos.length > 0 ? new Date(pagos[0].fechaEsperada).toLocaleDateString() : 'N/A',
                true);

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
    doc.addImage(logo, 'JPEG', 8, 8, 20, 20);
    renderContenido(0);

    doc.addImage(logo, 'JPEG', 8, 148, 20, 20);
    renderContenido(150);

    doc.save(`${cliente?.nombre || 'cliente'}_Credito.pdf`);
  };

  logo.onerror = () => {
    console.warn('No se cargó logo, se genera sin imagen');
    renderContenido(0);
    renderContenido(140);
    doc.save(`${cliente?.nombre || 'cliente'}_Credito.pdf`);
  };
}








 
}
