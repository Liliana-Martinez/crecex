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
            puntos: item.puntos??'',
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
    doc.setFontSize(20);
    doc.setFont('helvetica', 'normal');
    doc.text('CLIENTES ACTIVOS', 155, 15, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`SECCIÓN: ${zona}`, 105, 30);
    doc.text(`GRUPO: ${zona.split('-')[1] ?? ''}`, 60, 30);
    doc.text(`SEMANA: ${semana}`, 160, 30, { align: 'center' });
    doc.text(`PROMOTORA: ${promotora}`, 250, 30, { align: 'right' });
    doc.setFontSize(9);

    // Columnas
    const columnas = [
      { nombre: 'NUM', ancho: 8 },
      { nombre: 'CLA', ancho: 7 },
      { nombre: 'NOMBRE', ancho: 50 },
      { nombre: 'PUNTOS', ancho: 13 },
      { nombre: 'N° CRED', ancho: 15 },
      { nombre: 'CUMP.', ancho: 15 },
      { nombre: 'ENTREGA', ancho: 17 },
      { nombre: 'VENCIMIENTO', ancho: 22 },
      { nombre: 'SEM', ancho: 8 },
      { nombre: 'MONTO', ancho: 15 },
      { nombre: 'ABONO', ancho: 13 },
      { nombre: 'ATR', ancho: 10 },
      { nombre: 'AD', ancho: 10 },
      { nombre: 'RECUPERADO', ancho: 25 },
      { nombre: 'AD2', ancho: 25 },
      { nombre: 'MULTAS', ancho: 20 }
    ];

    const altoFila = 6;
    const margenX = 10;
    let y = 45;

    const dibujarEncabezado = () => {
      let x = margenX;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(23, 170, 214);
      columnas.forEach(col => {
        const centroX = x + col.ancho / 2;
        doc.rect(x, y, col.ancho, altoFila, 'F');
        doc.text(col.nombre, centroX, y + altoFila / 2 + 1, {
          align: 'center',
          baseline: 'middle'
        });
        doc.setFillColor(23, 170, 214);
        x += col.ancho;
      });

      y += altoFila;
      doc.setFont('helvetica', 'normal');
    };

    dibujarEncabezado();

    // === Cuerpo de la tabla ===
    this.dataPayment.forEach((item: any, index: number) => {
      let x = margenX;
      const fila = [
        index + 1,
        item.classification,
        item.name,
        `${item.puntos}`,
        item.loans,
        item.compliance,
        item.deliveryDate,
        item.dueDate,
        item.week,
        `$${item.monto}`,
        `$${item.weeklyAmount}`,
        item.latePayment === 0 ? '' : item.latePayment,
        item.earlyPayment === 0 ? '' : item.earlyPayment,
        item.nada ?? '',
        item.nada ?? '',
        item.nada ?? ''
      ];

      fila.forEach((valor, i) => {
        const col = columnas[i];
        const centroX = x + col.ancho / 2;

  
        let pintarColor = false;
        if (col.nombre === 'ATR' && item.latePayment !== 0) {
          doc.setFillColor (241, 82, 82); 
          pintarColor = true;
        } else if (col.nombre === 'AD' && item.earlyPayment !== 0) {
          doc.setFillColor (80, 175, 80); 
          pintarColor = true;
        }

        if (pintarColor) {
          doc.rect(x, y, col.ancho, altoFila, 'F');
        } else {
          doc.rect(x, y, col.ancho, altoFila);
        }

        if (col.nombre === 'NOMBRE') {
          doc.text(String(valor), x + 2, y + altoFila / 2 + 1, {
            align: 'left',
            baseline: 'middle'
          });
        } else {
          doc.text(String(valor), centroX, y + altoFila / 2 + 1, {
            align: 'center',
            baseline: 'middle'
          });
        }

        x += col.ancho;
      });

      y += altoFila;

      if (y > 190) {
        doc.addPage();
        y = 20;
        dibujarEncabezado();
      }
    });

    const deudaTotal = this.dataPayment.reduce(
      (acc: number, p: any) => acc + (Number(p.weeklyAmount) || 0), 0
    );

    doc.setFont('helvetica', 'bold');
    doc.text(`DEBE DE ENTREGAR: $${deudaTotal.toLocaleString('en-US')}`, 151, y + 5);

    doc.save(`${promotora}_${zona}_${this.fechaSiguienteSemana}.pdf`);
  };

  logo.onerror = () => {
    console.error('No se pudo cargar el logo.');
  };
}







}





