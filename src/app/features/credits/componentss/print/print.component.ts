import { Component, Input} from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-print',
  imports: [],
  templateUrl: './print.component.html',
  styleUrl: './print.component.css'
})
export class PrintComponent {
  @Input() datos: any;
  ngOnInit() {
    console.log('Datos a imprimir:', this.datos);
    if (this.datos) {
      this.imprimirCreditoFormato();
    }
    
  } 

  imprimirCreditoFormato() {
  if (!this.datos) {
    console.warn('No hay datos de cliente para imprimir');
    return;
  }

  const c = this.datos;
  const cliente = c.clientes || c.cliente;
  const credito = c.creditos || c.credito;
  const pagos = c.pagos || [];
  const zona = c.zona || {};

  const fechaHoy = new Date().toLocaleString();

  const doc = new jsPDF();

  const cargarImagen = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = e => reject(e);
    });
  };

  cargarImagen('/logo.jpg').then(logo => {
    doc.addImage(logo, 'JPEG', 10, 10, 25, 25);

    doc.setFontSize(14);
    doc.text('FORMATO DE CREDITO FINANCIERA CRECEX', 105, 20, { align: 'center' });

    // Encabezado
    doc.setFontSize(10);
    doc.text(`FORMATO DE CREDITO`, 10, 35);
    doc.text(`FECHA: ${fechaHoy}`, 120, 35);
    doc.text(`HORARIO: ${credito?.horarioEntrega || 'N/A'}`, 190, 35, { align: 'right' });

    // Zona
    doc.setFontSize(11);
    doc.text(`SECCIÓN: ${zona.codigoZona || '-'}`, 10, 45);
    doc.text(`GRUPO: -`, 50, 45);
    doc.text(`PROMOTORA: ${zona.promotora || '-'}`, 130, 45);

    // Cliente
    doc.setFontSize(12);
    doc.text(
      `CLIENTE: ${cliente?.nombre || ''} ${cliente?.apellidoPaterno || ''} ${cliente?.apellidoMaterno || ''}`,
      10,
      55
    );

    let y = 65;
    const fila = (label: string, value: string | number,color: [number, number, number] = [240, 240, 255]) => {
      doc.setFillColor(...color);
      doc.rect(10, y - 6, 190, 9, 'F');
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text(`${label}:`, 12, y);
      doc.text(`${value}`, 100, y);
      y += 11;
    };

    fila('TIPO DE CREDITO', credito?.tipoCredito || 'N/A');
    fila('MONTO', `$${credito?.monto ?? 0}`);
    fila('ABONO SEMANAL ANTERIOR', 'aún nada');
    fila('DEDUCCIONES SEM. RESTANTES', 'lógica no aplicada');
    fila('DEDUCCIONES DE SEM. TOTALES', 'lógica no aplicada');
    fila('ATRASOS', `$${credito?.atrasos ?? 0}`);
    fila('RECARGOS', `$${credito?.recargos ?? 0}`);
    fila('DEDUCCIONES TOTALES', 'lógica no aplicada');
    fila('CRÉDITO A ENTREGAR', `$${credito?.efectivo ?? 0}`, [200, 255, 200]);
    fila('SEMANAS CRÉDITO', `${credito?.semanas ?? 0} semanas`);
    fila('ABONO SEMANAL NUEVO', `$${credito?.abonoSemanal ?? 0}`);

    const fechaPrimerPago = (pagos && pagos.length > 0 && pagos[0].fechaEsperada)
      ? new Date(pagos[0].fechaEsperada).toLocaleDateString()
      : 'N/A';

    fila('FECHA DEL PRIMER PAGO', fechaPrimerPago);

    // Firma
    doc.setFontSize(9);
    doc.text('ENTREGÓ:', 105, 275);
    doc.text('RECIBÍ:', 105, 285);

    doc.save(`${cliente?.nombre || 'cliente'}_formato_credito.pdf`);
  }).catch(err => {
    console.error('Error cargando imagen del logo:', err);
    // Generar PDF sin logo
    doc.setFontSize(14);
    doc.text('FORMATO DE CREDITO FINANCIERA CRECEX', 105, 20, { align: 'center' });
    // (resto similar a lo de arriba)
    doc.save(`${cliente?.nombre || 'cliente'}_formato_credito.pdf`);
  });
}

 
}
