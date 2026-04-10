import { Component } from '@angular/core';
import { SearchBarZoneComponent } from '../../shared/componentes/search-bar-zone/search-bar-zone.component';
import { SaveButtonComponent } from "../../shared/componentes/save-button/save-button.component";
import { PrintButtonComponent } from "../../shared/componentes/print-button/print-button.component";
import { MatTableModule } from '@angular/material/table';
import { Zone } from '../../models/Zone';
import { ZoneService } from '../../core/services/zone.service';
import dayjs from 'dayjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../core/services/payment.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable'
//import dayjs from 'dayjs'; 

@Component({
  selector: 'app-payments',
  imports: [SearchBarZoneComponent, SaveButtonComponent, PrintButtonComponent, 
            MatTableModule, CommonModule, FormsModule,],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})


export class PaymentsComponent {
  constructor(
    private zoneService: ZoneService,
    private paymentService: PaymentService
  ) {}

  paymentCol: string[] = [
    'clients', 'name', 'loans', 'classification', 'compliance', 'deliveryDate',
    'dueDate', 'week', 'weeklyAmount', 'latePayment', 'earlyPayment', 'default',
    'paid', 'lateFees', 'payment', 'paymentType'
  ];

  idZona: number = 0;
  codigoZona: string = '';
  promotora: string = '';
  fechaSiguienteSemana: string = '';

  zonaSeleccionada: Zone | null = null;
  dataPayment: any = null;
  ClientsPayment: any[] = [];
  mensajeError: string = '';
  idCliente: number = 0;
  selectedOption: string = 'efectivo';

  // Colores por tipo de estado
  getClass(field: string, value: number): string {

    if (field === 'earlyPayment' && value > 0) return 'celda-verde';
    if (field === 'latePayment' && value > 0) return 'celda-roja';
    if (field === 'default' && value > 0) return 'celda-amarilla';
    return '';
  }
  //colores pagado o no
  getClas(campo: string, valor: any): string {
  if (campo === 'paid') {
    return valor !== null && valor > 0 ? 'pago-realizado' : 'pago-pendiente';
  }
  // Otras condiciones para otras columnas si las tienes
  return '';
}

  showErrorModal = false;
  errorMessage = '';

  closeErrorModal() {
    this.showErrorModal = false;
  }

  usarZona(zona: Zone) {
  console.log('Zona seleccionada en pagos: ', zona);
  this.zonaSeleccionada = zona;
  this.idZona = zona.id;

  this.zoneService.zoneData(this.idZona).subscribe({
    next: (response) => {
      this.codigoZona = response.codigoZona;
      this.promotora = response.promotora;
      this.fechaSiguienteSemana = response.fechaSiguienteSemana;
      this.ClientsPayment = response.clientes;
      console.log('Datos de table:',this.ClientsPayment )
      if (this.ClientsPayment && this.ClientsPayment.length > 0) {
        this.dataPayment = this.ClientsPayment.map((item: any, index: number) => ({
          idCredito: item.idCredito,
          clients: index + 1,
          name: item.nombreCompleto,
          loans: item.numeroCreditos,
          classification: item.clasificacion,
          compliance: item.cumplimiento,
          deliveryDate: item.fechaEntrega ? dayjs(item.fechaEntrega).format('DD/MM/YYYY') : '',
          dueDate: item.fechaVencimiento ? dayjs(item.fechaVencimiento).format('DD/MM/YYYY') : '',
          week: item.numeroSemana ?? '',
          monto: item.monto ?? '',
          puntos: item.puntos ?? '',
          weeklyAmount: item.montoSemanal ?? '',
          latePayment: item.atraso ?? '',
          earlyPayment: item.adelanto ?? '',
          default: item.falla ?? '',
          lateFees: item.recargos ?? '',
          payment: '',
          paymentType: '',
          paid: item.cantidadEfectivo ?? ''
          
          
        }));
        this.calcularResumen(this.dataPayment);

      } else {
        this.dataPayment = [];
        this.errorMessage = 'No hay clientes con créditos activos en esta zona.';
        this.showErrorModal = true;
        
      }
    },
    error: (err) => {
      console.error('Error:', err);
      this.dataPayment = null;

      if (err.status === 404) {
        this.errorMessage = 'No hay clientes con créditos activos en esta zona.';
      } else {
        this.errorMessage = 'Ocurrió un error al obtener los datos.';
      }

      this.showErrorModal = true;
    }
  });
}
total: number = 0;
cobrado: number = 0;
porcentajeCobranza: string = '0%';

 calcularResumen(clientesZona: any[]) {
  let total = 0;
  let cobrado = 0;
  console.log('Totales', this.dataPayment);

  for (const cliente of clientesZona) {
    if (cliente.week >= 1) {
      const semanal = cliente.weeklyAmount || 0;
      const falla = cliente.default || 0;

      total += semanal;
      cobrado += semanal - falla;
    }
  }

  const porcentaje = total > 0 ? (cobrado / total) * 100 : 0;

  this.total = total;
  this.cobrado = cobrado;
  this.porcentajeCobranza = porcentaje.toFixed(2) + '%';
}


  guardarPagos() {
  if (!this.zonaSeleccionada || !this.dataPayment || this.dataPayment.length === 0) {
    this.errorMessage = 'Debes seleccionar una zona antes de guardar.';
    this.showErrorModal = true;
    return;
  }

  const pagosAEnviar = this.dataPayment.map((item: any) => ({
    idCredito: item.idCredito,
    lateFees: item.lateFees,
    payment: item.payment,
    paymentType: item.paymentType
  }));

  console.log('Datos a enviar:', pagosAEnviar);

  this.paymentService.enviarPagos(pagosAEnviar).subscribe({
    next: (response) => {
      console.log('Respuesta del backend:', response);

      if (this.zonaSeleccionada) {
        this.usarZona(this.zonaSeleccionada);
      }
    },
    error: (err) => {
      console.error('Error al enviar pagos:', err);
    }
  });
  }

  imprimirPDF() {

  if (!this.zonaSeleccionada || !this.dataPayment || this.dataPayment.length === 0) {
    this.errorMessage = 'Debes seleccionar una zona antes de imprimir.';
    this.showErrorModal = true;
    return;
  }

  const doc = new jsPDF('landscape', 'mm', 'legal');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margenX = 10;
  const zona = this.codigoZona || 'N/A';
  const promotora = this.promotora || 'N/A';
  const semana = this.fechaSiguienteSemana || 'N/A';

  doc.setFont('helvetica', 'normal');
  doc.setLineWidth(0.2);
  doc.setDrawColor(210, 210, 210);
  doc.setFontSize(10);

  let maxNombreWidth = 0;

  this.dataPayment.forEach((item: any) => {
    const width = doc.getTextWidth(item.name || '');
    if (width > maxNombreWidth) maxNombreWidth = width;
  });

  const anchoNombreReal = maxNombreWidth + 8;
  const anchoNombreLimitado = Math.min(anchoNombreReal, 90);

  const columnasBase = [
    { nombre: 'NUM', ancho: 7 },
    { nombre: 'CLS', ancho: 9 },
    { nombre: 'NOMBRE', ancho: anchoNombreLimitado },
    { nombre: 'PUNTOS', ancho: 12 },
    { nombre: 'N° CRED', ancho: 14 },
    { nombre: 'CUMP.', ancho: 14 },
    { nombre: 'ENTREGA', ancho: 16 },
    { nombre: 'VENC.', ancho: 18 },
    { nombre: 'SEM', ancho: 8 },
    { nombre: 'MONTO', ancho: 15 },
    { nombre: 'ABONO', ancho: 14 },
    { nombre: 'ATR', ancho: 13 },
    { nombre: 'AD', ancho: 13 },
    { nombre: 'RECUPERADO', ancho: 20 },
    { nombre: 'AD2', ancho: 15 },
    { nombre: 'MULTAS', ancho: 15 }
  ];

  const anchoBaseTotal = columnasBase.reduce((acc, c) => acc + c.ancho, 0);
  const anchoDisponible = pageWidth - (margenX * 2);
  const escala = anchoDisponible / anchoBaseTotal;

  const columnas = columnasBase.map(col => ({
    nombre: col.nombre,
    ancho: col.ancho * escala
  }));

  const anchoTotalTabla = columnas.reduce((acc, c) => acc + c.ancho, 0);

  const logo = new Image();
  logo.src = '/logo.jpg';

  logo.onload = () => {

    doc.addImage(logo, 'JPEG', margenX, 8, 28, 28);

    // Título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(30, 30, 30);
    doc.text('LISTA DE CLIENTES ACTIVOS', pageWidth / 2, 18, { align: 'center' });

    // 🔹 ENCABEZADO EJECUTIVO CENTRADO EN BLOQUE
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);

    const textoEncabezado =
      `Zona: ${zona}     |     Grupo: ${zona.split('-')[1] ?? ''}     |     Promotor: ${promotora}     |     Semana: ${semana}`;

    doc.text(textoEncabezado, pageWidth / 2, 40, { align: 'center' });

    doc.setDrawColor(230, 230, 230);
    doc.line(margenX, 50, pageWidth - margenX, 50);

    let y = 60;
    const altoFila = 12;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.setFillColor(245, 245, 245);

    let x = margenX;

    columnas.forEach(col => {
      doc.rect(x, y, col.ancho, altoFila);
      doc.text(col.nombre, x + col.ancho / 2, y + 8, { align: 'center' });
      x += col.ancho;
    });

    y += altoFila;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    let totalAtraso = 0;
    let totalAdelanto = 0;

    this.dataPayment.forEach((item: any, index: number) => {

      if (y + altoFila > pageHeight - 25) {
        doc.addPage();
        doc.setLineWidth(0.2);
        doc.setDrawColor(210, 210, 210);
        y = 20;
      }

      if (index % 2 === 0) {
        doc.setFillColor(252, 252, 252);
        doc.rect(margenX, y, anchoTotalTabla, altoFila, 'F');
      }

      const atrasoVal =
        item.latePayment > 0
          ? `$${Number(item.latePayment).toLocaleString('en-US')}`
          : '';

      const adelantoVal =
        item.earlyPayment > 0
          ? `$${Number(item.earlyPayment).toLocaleString('en-US')}`
          : '';

      if (item.latePayment > 0) totalAtraso += Number(item.latePayment);
      if (item.earlyPayment > 0) totalAdelanto += Number(item.earlyPayment);

      const fila = [
        index + 1,
        item.classification,
        item.name,
        item.puntos,
        item.loans,
        item.compliance,
        item.deliveryDate,
        item.dueDate,
        item.week,
        item.monto ? `$${Number(item.monto).toLocaleString('en-US')}` : '',
        item.weeklyAmount ? `$${Number(item.weeklyAmount).toLocaleString('en-US')}` : '',
        atrasoVal,
        adelantoVal,
        item.recuperado ? `$${Number(item.recuperado).toLocaleString('en-US')}` : '',
        item.ad2 ? `$${Number(item.ad2).toLocaleString('en-US')}` : '',
        item.multas ? `$${Number(item.multas).toLocaleString('en-US')}` : ''
      ];

      x = margenX;

      fila.forEach((valor, i) => {

        const col = columnas[i];

        if (col.nombre === 'ATR' && atrasoVal !== '') {
          doc.setTextColor(170, 40, 40);
        } else if (col.nombre === 'AD' && adelantoVal !== '') {
          doc.setTextColor(30, 120, 60);
        } else {
          doc.setTextColor(60, 60, 60);
        }

        if (col.nombre === 'NOMBRE') {
          doc.text(String(valor), x + 3, y + 8);
        } else {
          doc.text(String(valor), x + col.ancho / 2, y + 8, { align: 'center' });
        }

        x += col.ancho;
      });

      y += altoFila;

      doc.setDrawColor(235, 235, 235);
      doc.line(margenX, y, margenX + anchoTotalTabla, y);
    });

    y += 15;

    const deudaTotal = this.dataPayment.reduce(
      (acc: number, p: any) =>
        acc + ((p.week && Number(p.week) > 0) ? Number(p.weeklyAmount) : 0),
      0
    );

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);

    doc.setTextColor(30, 30, 30);
    doc.text(`TOTAL A ENTREGAR: $${deudaTotal.toLocaleString('en-US')}`, margenX, y);

    doc.setTextColor(170, 40, 40);
    doc.text(`Atraso: $${totalAtraso.toLocaleString('en-US')}`, margenX + 150, y);

    doc.setTextColor(30, 120, 60);
    doc.text(`Adelanto: $${totalAdelanto.toLocaleString('en-US')}`, margenX + 220, y);

    doc.save(`REPORTE_${promotora}_${zona}_${semana}.pdf`);
  };

  logo.onerror = () => {
    console.error('No se pudo cargar el logo.');
  };
}




}





