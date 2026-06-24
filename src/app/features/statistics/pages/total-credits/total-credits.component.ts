import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DailyReportCreditsListComponent } from '../../components/daily-report-credits-list/daily-report-credits-list.component';
import { WeeklyReportCreditsListComponent } from '../../components/weekly-report-credits-list/weekly-report-credits-list.component';
import { MonthlyReportCreditsListComponent } from '../../components/monthly-report-credits-list/monthly-report-credits-list.component';
import { PrintButtonComponent } from '../../../../shared/componentes/print-button/print-button.component';
import { PrintComponent } from '../../../credits/componentss/print/print.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-total-credits',
  imports: [FormsModule, 
    CommonModule,
    DailyReportCreditsListComponent,
    WeeklyReportCreditsListComponent,
    MonthlyReportCreditsListComponent,
    PrintButtonComponent,
    PrintComponent],
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
 imprimirPDF() {
  if (!this.creditos || this.creditos.length === 0) {
    console.warn('No hay datos para imprimir');
    return;
  }
  const doc = new jsPDF('l', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const generarPDF = () => {

    // ✔ TÍTULO
    doc.setFontSize(14);
    doc.setTextColor(30, 90, 160);
    doc.text('REPORTE DE CRÉDITOS', pageWidth / 2, 15, { align: 'center' });
    //Subttuloo
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(`Tipo de reporte: ${this.selectedList}`, pageWidth / 2, 22, { align: 'center' });
    const columnas = [
      'N°',
      'ID Crédito',
      'Cliente',
      'Monto',
      'Abono Semanal',
      'Fecha',
      'Promotor',
      'Semanas',
      'Papelería Completa',
      'Faltante'
    ];
    let totalMonto = 0;
    let totalAbono = 0;
    const filas = this.creditos.map((c, index) => {
      const monto = Number(c.creditAmount) || 0;
      const abono = Number(c.abonoSemanal) || 0;
      totalMonto += monto;
      totalAbono += abono;
      return [
        index + 1,
        c.idCredit,
        c.client,
        monto,
        abono,
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
        2: { halign: 'left', cellWidth: 40 },
        3: { halign: 'right', cellWidth: 20 },
        4: { halign: 'right', cellWidth: 25 },
        5: { halign: 'center', cellWidth: 22 },
        6: { halign: 'left', cellWidth: 25 },
        7: { halign: 'center', cellWidth: 18 },
        8: { halign: 'center', cellWidth: 35 },
        9: { halign: 'center', cellWidth: 45 }
      },
      didParseCell: (data: any) => {
        if (data.column.index === 9) {
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.fontStyle = 'bold';
        }
      },
      margin: { top: 30 }
    });
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setTextColor(30, 90, 160);
    doc.text(`Total Monto: $${totalMonto}`, 14, finalY);
    doc.text(`Total Abono Semanal: $${totalAbono}`, 14, finalY + 6);
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