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
  imports: [SearchBarZoneComponent, SaveButtonComponent, PrintButtonComponent, MatTableModule, CommonModule, FormsModule],
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
    'lateFees', 'payment', 'paymentType'
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

  usarZona(zona: Zone) {
    console.log('Zona seleccionada en pagos: ', zona);
    this.zonaSeleccionada = zona;
    this.idZona = zona.id;

    this.zoneService.zoneData(this.idZona).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);

        // Extrae los datos generales
        this.codigoZona = response.codigoZona;
        this.promotora = response.promotora;
        this.fechaSiguienteSemana = response.fechaSiguienteSemana;

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
            weeklyAmount: item.montoSemanal ?? '',
            latePayment: item.atraso ?? '',
            earlyPayment: item.adelanto ?? '',
            default: item.falla ?? '',
            lateFees: item.recargos ?? '',
            payment: '',
            paymentType: ''
          }));
        } else {
          this.dataPayment = [];
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.dataPayment = null;
        this.mensajeError = err.status === 404
          ? 'No hay clientes con créditos activos en esta zona'
          : 'Ocurrió un error al obtener los datos';
      }
    });
  }

  guardarPagos() {
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
  const doc = new jsPDF('landscape');
  const fechaHoy = new Date().toLocaleDateString('es-MX');
  const zona = this.codigoZona || 'N/A';
  const promotora = this.promotora || 'N/A';
  const semana = this.fechaSiguienteSemana || 'N/A';

  const logo = new Image();
  logo.src = '/logo.jpg';

  logo.onload = () => {
    doc.addImage(logo, 'JPEG', 10, 5, 20, 20);

    // Encabezado
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('CLIENTES ACTIVOS', 155, 15, { align: 'center' });
    doc.text(`SECCIÓN: ${zona}`, 105, 30);
    doc.text(`GRUPO: ${zona.split('-')[1] ?? ''}`, 60, 30);
    doc.text(`SEMANA: ${semana}`, 160, 30, { align: 'center' });
    doc.text(`PROMOTORA: ${promotora}`, 250, 30, { align: 'right' });
    doc.setFontSize(9);

    // Definición de columnas
    const columnas = [
      { nombre: 'NUM', ancho: 8 },
      { nombre: 'CLA', ancho: 7 },
      { nombre: 'NOMBRE', ancho: 50 },
      { nombre: 'N° CRED', ancho: 15 },
      { nombre: 'CUMP.', ancho: 15 },
      { nombre: 'ENTREGA', ancho: 17 },
      { nombre: 'VENCIMIENTO', ancho: 22 },
      { nombre: 'SEM', ancho: 8 },
      { nombre: 'MONTO', ancho: 15 },
      { nombre: 'ABONO', ancho: 13 },
      { nombre: 'A', ancho: 10 },
      { nombre: 'AD', ancho: 10 },
      { nombre: 'F', ancho: 10 },
      { nombre: 'PUNTOS', ancho: 13 },
      { nombre: 'PAGO', ancho: 20 },
      { nombre: 'AD2', ancho: 20 },
      { nombre: 'MULTAS', ancho: 20 }
    ];

    const columnasCentradas = ['NUM', 'N° CRED', 'SEM'];

    const altoFila = 6;
    const margenX = 10;
    let y = 45;

    // Encabezado tabla
    let x = margenX;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor (23, 170, 214); 

    columnas.forEach(col => {
      doc.rect(x, y, col.ancho, altoFila, 'F');
      
      if (columnasCentradas.includes(col.nombre)) {
        doc.text(col.nombre, x + col.ancho / 2, y + 4, { align: 'center' });
        doc.setFillColor (23, 170, 214); 
      } else {
        doc.text(col.nombre, x + 1, y + 4);
        doc.setFillColor (23, 170, 214); 
      }
      x += col.ancho;
    });

    y += altoFila;
    doc.setFont('helvetica', 'normal');

    // Cuerpo de la tabla
    this.dataPayment.forEach((item: any, index: number) => {
      x = margenX;
      const fila = [
        index + 1,
        item.classification,
        item.name,
        item.loans,
        item.compliance,
        item.deliveryDate,
        item.dueDate,
        item.week,
        `$${item.monto}`,
        `$${item.weeklyAmount}`,
        item.latePayment,
        item.earlyPayment,
        item.default,
        `$${item.lateFees}`,
        item.payment ?? '',
        item.paymentType ?? '',
        item.paymentType ?? ''
      ];

      fila.forEach((valor, i) => {
        const col = columnas[i];
        doc.rect(x, y, col.ancho, altoFila);

        if (columnasCentradas.includes(col.nombre)) {
          doc.text(String(valor), x + col.ancho / 2, y + 4, { align: 'center' });
        } else {
          doc.text(String(valor), x + 1, y + 4);
        }

        x += col.ancho;
      });

      y += altoFila;

      // Nueva página si rebasa
      if (y > 190) {
        doc.addPage();
        y = 20;
        x = margenX;
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(220, 220, 220);
        columnas.forEach(col => {
          doc.rect(x, y, col.ancho, altoFila, 'F');
          if (columnasCentradas.includes(col.nombre)) {
            doc.text(col.nombre, x + col.ancho / 2, y + 4, { align: 'center' });
          } else {
            doc.text(col.nombre, x + 1, y + 4);
          }
          x += col.ancho;
        });
        y += altoFila;
        doc.setFont('helvetica', 'normal');
      }
    });

    // Total
    const deudaTotal = this.dataPayment.reduce(
      (acc: number, p: any) => acc + (Number(p.weeklyAmount) || 0), 0
    );
    doc.setFont('helvetica', 'bold');
    doc.text(`DEBE DE ENTREGAR: $${deudaTotal.toLocaleString('en-US')}`, 15, y + 16);

    // Guardar
    doc.save(`${promotora}_${zona}_${this.fechaSiguienteSemana}.pdf`);
  };

  logo.onerror = () => {
    console.error('No se pudo cargar el logo.');
  };
}





}





