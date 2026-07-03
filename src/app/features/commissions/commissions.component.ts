import { Component } from '@angular/core';
import { SearchBarZoneComponent } from '../../shared/componentes/search-bar-zone/search-bar-zone.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Zone } from '../../models/Zone';
import { CommissionsService } from '../../core/services/commissions.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SaveButtonComponent } from "../../shared/componentes/save-button/save-button.component";
import { PrintButtonComponent } from '../../shared/componentes/print-button/print-button.component';
import jsPDF from 'jspdf';

export interface commissionsData {
  collectionRate: number;
  collectionExpenses: number;
  numberCredits: number;
  extras: number;
  totalAmount: number;
}
@Component({
  selector: 'app-commissions',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SearchBarZoneComponent,
    MatTableModule,
    FormsModule,
    SaveButtonComponent,
    PrintButtonComponent
  ],
  templateUrl: './commissions.component.html',
  styleUrl: './commissions.component.css'
})
export class CommissionsComponent {
  commissionsCol: string[] = [
    'collectionRate',// Comisión
    'collectionExpenses',// Gastos de cobranza
    'numberCredits',// No de créditos
    'extras',// Extras
    'totalAmount',// Total (suma)
  ];
  dataCommissions = new MatTableDataSource<any>();
  extraCommissionForm!: FormGroup;
  value: number = 0;//Valor que se ingresara en el input
  promoter: string = '';
  totalExpected: number = 0;
  totalCollected: number = 0;
  collectionPercentage: number = 0;
  commissionPercentage: number = 0;
  constructor(private commissionsService: CommissionsService) {}
  ngOnInit(): void {
    this.extraCommissionForm = new FormGroup({
      extra: new FormControl(''),
      description: new FormControl('')
    });
  }

  onZoneSelected(zone: Zone) {
    console.log("Zona recibida del search:", zone);
    console.log("Mandando idZona al back:", zone.id);
    this.commissionsService.getCommissionsByZone(zone.id).subscribe((resp: any) => {
      console.log("Datos del backend:", resp);
      // Mapeamos los datos del back a lo que espera la tabla
      this.promoter = resp.resultado.collectionRate.promoter;
      this.totalExpected = resp.resultado.collectionRate.totalExpected;
      this.totalCollected = resp.resultado.collectionRate.totalCollected;
      this.collectionPercentage = resp.resultado.collectionRate.collectionPercentage;
      this.commissionPercentage = resp.resultado.collectionRate.commissionPercentage;
      const mapped: commissionsData = {
        collectionExpenses: resp.resultado.collectionExpenses,// Gastos de cobranza
        collectionRate: resp.resultado.collectionRate.collectionRate,// Comisión %
        numberCredits: resp.resultado.numberCredits,// No. de créditos
        extras: Number(resp.resultado.extras) || 0,// Extras
        totalAmount: resp.resultado.totalAmount// Total general

      };
      // Cargamos en la tabla (tiene que ser array)
      this.dataCommissions.data = [mapped];
    });
  }
  addExtraCommission() {
    const extra = Number(this.value);
    console.log('Valor del campo:', extra);
    if (!extra) return;//No suma si el campo esta vacio
    const registro = this.dataCommissions.data[0];
    registro.extras = Number(registro.extras) + extra;
    this.dataCommissions.data = [registro];
    this.value = 0;
  }
  imprimirComisiones() {
  const doc = new jsPDF();
  const registro = this.dataCommissions.data[0];
  const hoy = new Date();
  const fecha = `${String(hoy.getDate()).padStart(2,'0')}-${String(hoy.getMonth()+1).padStart(2,'0')}-${hoy.getFullYear()}`;
  const nombrePromotora = this.promoter.replace(/\s+/g,'_');
  const comisionTotal =
    Number(registro.collectionRate) +
    Number(registro.collectionExpenses) +
    Number(registro.extras) +
    Number(registro.numberCredits);
  // Titulo
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORTE DE COMISIONES', 105, 18, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`Promotora: ${this.promoter}`, 105, 27, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${fecha}`, 105, 34, { align: 'center' });
//cUADROS
  const dibujarCuadro = (
    x: number,
    y: number,
    titulo: string,
    valor: string,
    mostrarValor: boolean = true
  ) => {
    doc.setDrawColor(0);
    doc.roundedRect(x, y, 55, 26, 2, 2);
    doc.setFillColor(30, 55, 100);
    doc.rect(x, y, 55, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255);
    doc.text(titulo, x + 27.5, y + 5.5, { align: 'center' });

    if (mostrarValor) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0);
      doc.setFontSize(15);
      doc.text(valor, x + 27.5, y + 18, { align: 'center' });
    }

  };
  //cOPIA SIN DATOS
  let y = 45;
  dibujarCuadro(10, y, "DEBE ENTREGAR", "", false);
  dibujarCuadro(75, y, "ENTREGÓ", "", false);
  dibujarCuadro(140, y, "PORCENTAJE", "", false);
  y += 32;
  dibujarCuadro(10, y, "COMISIÓN %", "", false);
  dibujarCuadro(75, y, "COMISIÓN", "", false);
  dibujarCuadro(140, y, "MULTAS", "", false);
  y += 32;
  dibujarCuadro(10, y, "EXTRAS", "", false);
  dibujarCuadro(75, y, "CRÉDITOS", "", false);
  dibujarCuadro(140, y, "COMISIÓN TOTAL", "", false);
  //eSPACION ENTRE UNO Y OTRO 
  y += 38;
  y += 10;

  //CON LOS DATOS
  dibujarCuadro(10, y, "DEBE ENTREGAR", `$ ${this.totalExpected.toFixed(2)}`);
  dibujarCuadro(75, y, "ENTREGÓ", `$ ${this.totalCollected.toFixed(2)}`);
  dibujarCuadro(140, y, "PORCENTAJE", `${this.collectionPercentage}%`);
  y += 32;
  dibujarCuadro(10, y, "COMISIÓN %", `${this.commissionPercentage}%`);
  dibujarCuadro(75, y, "COMISIÓN", `$ ${registro.collectionRate.toFixed(2)}`);
  dibujarCuadro(140, y, "MULTAS", `$ ${registro.collectionExpenses.toFixed(2)}`);
  y += 32;
  dibujarCuadro(10, y, "EXTRAS", `$ ${registro.extras.toFixed(2)}`);
  dibujarCuadro(75, y, "CRÉDITOS", `${registro.numberCredits}`);
  // COMISIÓN TOTAL
  doc.setDrawColor(0);
  doc.roundedRect(140, y, 55, 26, 2, 2);
  doc.setFillColor(30, 55, 100);
  doc.rect(140, y, 55, 8, 'F');
  doc.setTextColor(255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text("COMISIÓN TOTAL", 167.5, y + 5.5, { align: 'center' });
  doc.setTextColor(0, 120, 0);
  doc.setFontSize(16);
  doc.text(`$ ${comisionTotal.toFixed(2)}`, 167.5, y + 18, {
    align: 'center'
  });
  doc.save(`${nombrePromotora}_${fecha}.pdf`);
}

}