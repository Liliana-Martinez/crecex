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

  const fila = (
    label: string,
    value: string | number,
    y: number
  ) => {
    
    doc.rect(10, y - 4, 90, 6, 'F');
    doc.setFontSize(8);
    doc.setTextColor(0);
    doc.text(`${label}:`, 12, y);
    doc.text(`${value}`, 70, y);
  };

  const renderContenido = (offsetY: number) => {
    doc.setFontSize(14);
    doc.text('FORMATO DE CREDITO FINANCIERA CRECEX', 105, 20 + offsetY, { align: 'center' });

    doc.setFontSize(8);
    const fechaHoy = dayjs().format('DD/MM/YYYY');
    doc.text(`FECHA: ${fechaHoy}`, 100, 35 + offsetY);
    doc.text(`HORARIO: ${credito?.horarioEntrega || 'N/A'}`, 180, 35 + offsetY, { align: 'right' });

    doc.text(`SECCIÓN: ${zona.codigoZona || '-'}`, 10, 35 + offsetY);
    doc.text(`PROMOTORA: ${zona.promotora || '-'}`, 100, 45 + offsetY);
    doc.text(
      `CLIENTE: ${cliente?.nombre} ${cliente?.apellidoPaterno} ${cliente?.apellidoMaterno}`,
      10,
      45 + offsetY
    );

    let y = 50 + offsetY;
    const salto = 6;

    fila('TIPO DE CREDITO', credito?.tipoCredito || 'N/A', y += salto);
    fila('MONTO', `$${credito?.monto ?? 0}`, y += salto);
    fila('ABONO SEMANAL ANTERIOR', 'aún nada', y += salto);
    fila('DEDUCCIONES SEM. RESTANTES', 'lógica no aplicada', y += salto);
    fila('DEDUCCIONES DE SEM. TOTALES', 'lógica no aplicada', y += salto);
    fila('ATRASOS', `$${credito?.atrasos ?? 0}`, y += salto);
    fila('RECARGOS', `$${credito?.recargos ?? 0}`, y += salto);
    fila('DEDUCCIONES TOTALES', 'lógica no aplicada', y += salto);
    fila('CRÉDITO A ENTREGAR', `$${credito?.efectivo ?? 0}`, y += salto);
    fila('SEMANAS CRÉDITO', `${credito?.semanas ?? 0} semanas`, y += salto);
    fila('ABONO SEMANAL NUEVO', `$${credito?.abonoSemanal ?? 0}`, y += salto);

    const fechaPrimerPago = pagos.length > 0
      ? new Date(pagos[0].fechaEsperada).toLocaleDateString()
      : 'N/A';
    fila('FECHA DEL PRIMER PAGO', fechaPrimerPago, y += salto);

    doc.setFontSize(9);
    doc.text('ENTREGÓ:', 10, y + 10);
    doc.text('RECIBÍ:', 120, y + 10);
  };

  //logo
  const logo = new Image();
  logo.src = '/logo.jpg';

  logo.onload = () => {
    // Primera mitad
    doc.addImage(logo, 'JPEG', 8, 8, 20, 20);
    renderContenido(0);

    // Segunda mitad
    doc.addImage(logo, 'JPEG', 8, 148, 20, 20); 
    renderContenido(140); 

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
