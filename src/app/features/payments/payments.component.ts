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
    'adeudo', 'lateFees', 'payment', 'paymentType'
  ];
  idZona: number = 0;
  codigoZona: string = '';
  promotor: string = '';
  fechaSiguienteSemana: string = '';
  zonaSeleccionada: Zone | null = null;
  dataPayment: any = null;
  ClientsPayment: any[] = [];

  // colecctionRate del backend
  collectionRate: any = null;
  mensajeError: string = '';
  idCliente: number = 0;
  selectedOption: string = 'efectivo';
  showErrorModal = false;
  errorMessage = '';
  total: number = 0;
  cobrado: number = 0;
  porcentajeCobranza: string = '0%';
  getClass(field: string, value: number): string {
    if (field === 'earlyPayment' && value > 0) return 'celda-verde';
    if (field === 'latePayment' && value > 0) return 'celda-roja';
    if (field === 'default' && value > 0) return 'celda-amarilla';
    return '';
  }
  getClas(campo: string, valor: any): string {
    if (campo === 'adeudo') {
      return valor !== null && valor > 0 ? 'pago-realizado' : 'pago-pendiente';
    }
    return '';
  }
  closeErrorModal() {
    this.showErrorModal = false;
  }
  usarZona(zona: Zone) {
    this.zonaSeleccionada = zona;
    this.idZona = zona.id;
    this.zoneService.zoneData(this.idZona).subscribe({
      next: (response) => {
        console.log('🔵 RESPUESTA:', response);
        this.codigoZona = response.codigoZona;
        this.promotor = response.promotor;
        this.fechaSiguienteSemana = response.fechaSiguienteSemana;
        this.collectionRate = response.collectionRate;
        this.total = this.collectionRate?.sumAmount || 0;
        this.cobrado = this.collectionRate?.sumAmountPaid || 0;
        const porcentaje =
          this.total > 0 ? (this.cobrado / this.total) * 100 : 0;
        this.porcentajeCobranza = porcentaje.toFixed(2) + '%';
        this.ClientsPayment = response.clientes;
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
            adeudo: item.adeudo ?? ''
          }));
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
    this.paymentService.enviarPagos(pagosAEnviar).subscribe({
      next: () => {
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
    const promotor = this.promotor || 'N/A';
    const semana = this.fechaSiguienteSemana || 'N/A';

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    let maxNombreWidth = 0;

    this.dataPayment.forEach((item: any) => {
      const width = doc.getTextWidth(item.name || '');
      if (width > maxNombreWidth) maxNombreWidth = width;
    });

    const anchoNombreLimitado = Math.min(maxNombreWidth + 8, 90);

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

    const logo = new Image();
    logo.src = '/logo.jpg';

    logo.onload = () => {

      doc.addImage(logo, 'JPEG', margenX, 8, 28, 28);

      doc.setFontSize(22);
      doc.text('LISTA DE CLIENTES ACTIVOS', pageWidth / 2, 18, { align: 'center' });

      doc.setFontSize(12);
      doc.text(
        `Zona: ${zona} | Promotor: ${promotor} | Semana: ${semana}`,
        pageWidth / 2,
        40,
        { align: 'center' }
      );

      doc.save(`REPORTE_${promotor}_${zona}_${semana}.pdf`);
    };
  }
   
}


 





