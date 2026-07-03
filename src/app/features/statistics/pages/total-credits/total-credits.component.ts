import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DailyReportCreditsListComponent } from '../../components/daily-report-credits-list/daily-report-credits-list.component';
import { WeeklyReportCreditsListComponent } from '../../components/weekly-report-credits-list/weekly-report-credits-list.component';
import { MonthlyReportCreditsListComponent } from '../../components/monthly-report-credits-list/monthly-report-credits-list.component';
import { PrintButtonComponent } from '../../../../shared/componentes/print-button/print-button.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-total-credits',
  imports: [FormsModule, 
    CommonModule,
    DailyReportCreditsListComponent,
    WeeklyReportCreditsListComponent,
    MonthlyReportCreditsListComponent,
    PrintButtonComponent,],
  templateUrl: './total-credits.component.html',
  styleUrl: './total-credits.component.css'
})
export class TotalCreditsComponent {

  selectedList: string = "dailyCredits";
  creditos: any[] = [];
  constructor() {}

  recibirCreditos(data: any[]) {
    console.log(' PADRE RECIBIO PARA IMPRIMIR:', data);
    console.log(' TIPO DE REPORTE:', this.selectedList);

    this.creditos = data;
  }
  getDescripcionReporte(): string {
  const hoy = new Date();
  switch (this.selectedList) {
    case 'dailyCredits':
      return `Fecha: ${hoy.toLocaleDateString('es-MX')}`;
    case 'weeklyCredits': {
      const inicio = new Date(hoy);
      const fin = new Date(hoy);
      // Día de la semana (domingo=0, lunes=1, ..., sábado=6)
      const dia = hoy.getDay();
      // Calcular el sábado de la semana
      const diasDesdeSabado = (dia + 1) % 7;
      inicio.setDate(hoy.getDate() - diasDesdeSabado);
      // El viernes siguiente
      fin.setDate(inicio.getDate() + 6);
      return `Del ${inicio.toLocaleDateString('es-MX')} al ${fin.toLocaleDateString('es-MX')}`;
    }
    case 'monthlyCredits': {
      const mes = hoy.toLocaleDateString('es-MX', {
        month: 'long',
        year: 'numeric'
      });
      return mes.charAt(0).toUpperCase() + mes.slice(1);
    }
    default:
      return '';
  }
}
 imprimirPDF() {
  if (!this.creditos || this.creditos.length === 0) {
    console.warn('No hay datos para imprimir');
    return;
  }

  const doc = new jsPDF('l', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  const generarPDF = () => {

    // Título
    doc.setFontSize(14);
    doc.setTextColor(30, 90, 160);
    doc.text('REPORTE DE CRÉDITOS', pageWidth / 2, 15, { align: 'center' });

    // Subtítulo
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(this.getDescripcionReporte(), pageWidth / 2, 22, { align: 'center' });

    const columnas = [
      'N°',
      'ID Crédito',
      'Cliente',
      'Monto',
      'Tipo Crédito',
      'Fecha',
      'Promotor',
      'Semanas',
      'Papelería Completa',
      'Faltante'
    ];

    let totalMonto = 0;

    const filas = this.creditos.map((c, index) => {
      const monto = Number(c.creditAmount) || 0;
      totalMonto += monto;

      return [
        index + 1,
        c.idCredit,
        c.client,
        `$${monto.toLocaleString('es-MX')}`,
        c.typeCredit, // <-- Tipo de crédito
        c.date,
        c.promoter,
        c.creditWeeks,
        '',
        ''
      ];
    });

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 35,
      styles: {
        fontSize: 9,
        cellPadding: 2,
        lineColor: [210, 220, 240],
        lineWidth: 0.1,
        textColor: [60, 60, 60],
        valign: 'middle'
      },
      headStyles: {
        fillColor: [30, 90, 160],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 248, 255]
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'center', cellWidth: 18 },
        2: { halign: 'left', cellWidth: 55 },
        3: { halign: 'right', cellWidth: 22 },
        4: { halign: 'center', cellWidth: 28 },
        5: { halign: 'center', cellWidth: 24 },
        6: { halign: 'left', cellWidth: 28 },
        7: { halign: 'center', cellWidth: 18 },
        8: { halign: 'center', cellWidth: 35 },
        9: { halign: 'center', cellWidth: 35 }
      },
      margin: { top: 30 }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(11);
    doc.setTextColor(30, 90, 160);
    doc.text(
      `Total Monto: $${totalMonto.toLocaleString('es-MX')}`,
      14,
      finalY
    );

    doc.save('reporte-creditos.pdf');
  };

  const img = new Image();
  img.src = '/logo2.jpeg';

  img.onload = () => {
    doc.addImage(img, 'JPEG', 10, 3, 45, 28);
    generarPDF();
  };

  img.onerror = () => {
    console.warn('No se pudo cargar el logo');
    generarPDF();
  };
}

}