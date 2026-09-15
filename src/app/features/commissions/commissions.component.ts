import { Component } from '@angular/core';
import { SearchBarZoneComponent } from '../../shared/componentes/search-bar-zone/search-bar-zone.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Zone } from '../../models/Zone';
import { CommissionsService } from '../../core/services/commissions.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SaveButtonComponent } from "../../shared/componentes/save-button/save-button.component";
import { PrintButtonComponent } from '../../shared/componentes/print-button/print-button.component';
import jsPDF from 'jspdf';
import { FORM_VALIDATORS } from '../clients-guarantors/constants/form-validators';

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
  totalBase: number = 0;
  collectionPercentage: number = 0;
  commissionPercentage: number = 0;
  commisionByZone: any;

  constructor(private commissionsService: CommissionsService) {}

  ngOnInit(): void {
    this.extraCommissionForm = new FormGroup({
      extra: new FormControl(''),
      description: new FormControl('', FORM_VALIDATORS.NAME)
    });

    //Escuchar cambios en el input de extra
    this.extraCommissionForm.get('extra')?.valueChanges.subscribe(() => {
      this.udpateColumnTotalAmount();
    })
  }

  //Cargar los datos en la tabla de la zona buscada
  onZoneSelected(zone: Zone) {
    console.log("Zona recibida del search:", zone);
    console.log("Mandando idZona al back:", zone.id);
    
    this.commissionsService.getCommissionsByZone(zone.id).subscribe({
      next: (response: any) => {
        console.log('Respuesta del back: ', response);

        if(response && response.resultado) {
          const mapped = {
            collectionRate: response.resultado.collectionRate,
            collectionExpenses: response.resultado.collectionExpenses,
            numberCredits: response.resultado.numberCredits,
            extras: response.resultado.extras,
            totalAmount: response.resultado.total
          };
          this.totalBase = Number(response.resultado.total) || 0;
          this.dataCommissions.data = [mapped];
        }
      }, error: (err) => {
        console.log('Error al obtener las comisiones', err);
      }
    });
  }

  udpateColumnTotalAmount() {
    const row = this.dataCommissions.data[0];
    if (!row) return;

    const extra = Number(this.extraCommissionForm.get('extra')?.value) || 0;
    row.totalAmount = this.totalBase + extra; // siempre parte del base
    this.dataCommissions.data = [...this.dataCommissions.data];
  }
  
  addExtraCommission() {
  const extra = Number(this.extraCommissionForm.get('extra')?.value) || 0;
  const description = this.extraCommissionForm.get('description')?.value?.trim();

  if (!description) {
    console.log('La descripción es obligatoria');
    return;
  }

  const row = this.dataCommissions.data[0];
  const totalFinal = Number(row.totalAmount) + extra; // total visible + extra
  console.log('comision dentro del front: ', totalFinal);

  const payload = { total: totalFinal, description };
  this.commissionsService.saveExtra(payload).subscribe({
    next: () => {
      console.log('Extra guardado en caja');
      this.extraCommissionForm.reset();
    },
    error: (err: any) => console.log('Error al guardar', err)
  });
}


  imprimirComisiones() {
    const doc = new jsPDF();
    const registro = this.dataCommissions.data[0];
    const hoy = new Date();
    const fecha = `${String(hoy.getDate()).padStart(2, '0')}-${String(
      hoy.getMonth() + 1
    ).padStart(2, '0')}-${hoy.getFullYear()}`;
    const nombrePromotora = this.promoter.replace(/\s+/g, '_');
    const comisionTotal =
      Number(registro.collectionRate) +
      Number(registro.collectionExpenses) +
      Number(registro.extras) +
      Number(registro.numberCredits);

    // Tituloooo
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE COMISIONES', 105, 18, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`Promotora: ${this.promoter}`, 105, 27, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${fecha}`, 105, 34, { align: 'center' });

    //dibujarlos recuadros
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
      doc.text(titulo, x + 27.5, y + 5.5, {
        align: 'center'
      });
      if (mostrarValor) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0);
        doc.setFontSize(15);
        doc.text(valor, x + 27.5, y + 18, {
          align: 'center'
        });
      }
    };

    // cuadros sin informacio
    let y = 45;

    dibujarCuadro(10, y, "N° CLIENTES", "", false);
    dibujarCuadro(75, y, "DEBE ENTREGAR", "", false);
    dibujarCuadro(140, y, "MULTAS", "", false);

    y += 32;

    dibujarCuadro(10, y, "N° CLIENTES AD", "", false);
    dibujarCuadro(75, y, "ADELANTOS/DEPÓSITOS", "", false);
    dibujarCuadro(140, y, "ATRASO", "", false);

    y += 32;

    dibujarCuadro(10, y, "ADELANTOS", "", false);
    dibujarCuadro(75, y, "AD DEPOSITADO", "", false);
    dibujarCuadro(140, y, "TOTAL A ENTREGAR", "", false);

    // Separación entre la copia en blanco y la información
    y += 42;

    // cuadros con informacion

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
    //suma de la comision total
    doc.setDrawColor(0);
    doc.roundedRect(140, y, 55, 26, 2, 2);
    doc.setFillColor(30, 55, 100);
    doc.rect(140, y, 55, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255);
    doc.text("COMISIÓN TOTAL", 167.5, y + 5.5, {
      align: 'center' 
    });

    doc.setTextColor(0, 120, 0);
    doc.setFontSize(16);
    doc.text(`$ ${comisionTotal.toFixed(2)}`, 167.5, y + 18, {
      align: 'center'
    });
    doc.save(`${nombrePromotora}_${fecha}.pdf`);
  }

}