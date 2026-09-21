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
  selectedList: string = 'dailyCredits';
  creditos: any[] = [];
  constructor() {}
  recibirCreditos(data: any[]) {
    this.creditos = data;
  }
  getDescripcionReporte(): string {
    const hoy = new Date();
    switch (this.selectedList) {
      case 'dailyCredits':
        return `Fecha: ${hoy.toLocaleDateString('es-MX')}`;
      case 'weeklyCredits': {
        const dia = hoy.getDay();
        const diasDesdeSabado = (dia + 1) % 7;
        const inicio = new Date(hoy);
        inicio.setDate(hoy.getDate() - diasDesdeSabado);
        const fin = new Date(inicio);
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
    if (!this.creditos.length) {
      console.warn('No hay datos para imprimir');
      return;
    }
    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const generarPDF = () => {
      // Título
      doc.setFontSize(14);
      doc.setTextColor(30, 90, 160);
      doc.text('REPORTE DE CRÉDITOS',pageWidth / 2,15,{ align: 'center' });
      // Subtítulo
      doc.setFontSize(10);
      doc.setTextColor(90, 90, 90);
      doc.text(this.getDescripcionReporte(),pageWidth / 2,22,{ align: 'center' });
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
      const totalMonto = this.creditos.reduce(
        (total, credito) =>
          total + (Number(credito.creditAmount) || 0),
        0
      );
      const filas = this.creditos.map((credito, index) => {
        const monto = Number(credito.creditAmount) || 0;
        return [
          index + 1,
          credito.idCredit,
          credito.client,
          `$${monto.toLocaleString('es-MX')}`,
          credito.typeCredit,
          credito.date,
          credito.promoter,
          credito.creditWeeks,
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
        }
      });
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(11);
      doc.setTextColor(30, 90, 160);
      doc.text(`Total Monto: $${totalMonto.toLocaleString('es-MX')}`,14,finalY);
      doc.save('reporte-creditos.pdf');
    };
    const img = new Image();
    img.src = '/logo2.jpeg';
    img.onload = () => {
      doc.addImage(img, 'JPEG', 13, 3, 32, 28);
      generarPDF();
    };
    img.onerror = () => {
      console.warn('No se pudo cargar el logo');
      generarPDF();
    };
  }
}