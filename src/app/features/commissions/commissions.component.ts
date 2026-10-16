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

  
  // Cargar los datos en la tabla de la zona buscada
  onZoneSelected(zone: Zone) {
  console.log('Zona recibida del search:', zone);
  console.log('Mandando idZona al back:', zone.id);

  this.commissionsService.getCommissionsByZone(zone.id).subscribe({
    next: (response: any) => {
      console.log('Respuesta del back:', response);

      if (response?.resultado) {

        const resultado = response.resultado;

        console.log('RESULTADO DE COMISIONES:', resultado);

        const mapped = {
          // Datos originales del backend
          collectionRate: Number(resultado.collectionRate) || 0,
          collectionExpenses: Number(resultado.collectionExpenses) || 0,
          numberCredits: Number(resultado.numberCredits) || 0,
          extras: Number(resultado.extras) || 0,

          totalExpected: Number(resultado.totalExpected) || 0,
          totalCollected: Number(resultado.totalCollected) || 0,
          collectionPercentage: Number(resultado.collectionPercentage) || 0,
          commissionPercentage: Number(resultado.commissionPercentage) || 0,
          promotor: resultado.promotor || '',

          // Total base que viene del backend
          total: Number(resultado.total) || 0,

          // Total que se muestra/edita en la tabla
          totalAmount: Number(resultado.total) || 0
        };

        this.totalBase = mapped.total;

        // Guardamos el registro completo
        this.dataCommissions.data = [mapped];

        // También actualizamos las variables del componente
        this.totalExpected = mapped.totalExpected;
        this.totalCollected = mapped.totalCollected;
        this.collectionPercentage = mapped.collectionPercentage;
        this.commissionPercentage = mapped.commissionPercentage;
        this.promoter = mapped.promotor;

        console.log('DATA PARA LA TABLA:', this.dataCommissions.data[0]);
      }
    },

    error: (err) => {
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
  const registro = this.dataCommissions?.data?.[0];
  if (!registro) {
    console.error('No existe información de comisiones para generar el PDF');
    return;
  }

  console.log('REGISTRO PARA PDF:', registro);

  const doc = new jsPDF();
  const hoy = new Date();
  const fecha = `${String(hoy.getDate()).padStart(2, '0')}-${String(
    hoy.getMonth() + 1).padStart(2, '0')}-${hoy.getFullYear()}`;
  const nombrePromotora =registro.promotor ||this.promoter ||'Promotora';
  const nombreArchivo =nombrePromotora.replace(/\s+/g, '_');
  const totalExpected =Number(registro.totalExpected ?? 0);
  const totalCollected =Number(registro.totalCollected ?? 0);
  const collectionPercentage =Number(registro.collectionPercentage ?? 0);
  const commissionPercentage =Number(registro.commissionPercentage ?? 0);
  const collectionRate =Number(registro.collectionRate ?? 0);
  const collectionExpenses =Number(registro.collectionExpenses ?? 0);
  const numberCredits =Number(registro.numberCredits ?? 0);
  const total =Number(registro.total ?? 0);
  // Extras que ya vienen del backend
  const extrasBackend =
    Number(registro.extras ?? 0);

  const totalAmount =Number(registro.totalAmount ?? total);
  const extraManual = Math.max(0,totalAmount - total);
  // Extras totales que aparecerán en el PDF
  const extras =extrasBackend + extraManual;
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORTE DE COMISIONES',105,18,{  align: 'center'});
  doc.setFontSize(14);
  doc.text(`Promotora: ${nombrePromotora}`,105,27,{align: 'center'});
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${fecha}`,105,34,{align: 'center'});
  const dibujarCuadro = (x: number,y: number,titulo: string,valor: string,mostrarValor: boolean = true) => {
    // Borde
    doc.setDrawColor(0);
    doc.roundedRect(x,y,55,26,2,2);
    // Encabezado
    doc.setFillColor(30,55,100);
    doc.rect(x,y,55,8,'F');
    // Título
    doc.setFont('helvetica','bold');
    doc.setFontSize(10);
    doc.setTextColor(255);
    doc.text(titulo,x + 27.5,y + 5.5,{align: 'center'});
    // Valor
    if (mostrarValor) {
      doc.setFont('helvetica','normal');
      doc.setTextColor(0);
      doc.setFontSize(15);
      doc.text(valor,x + 27.5,y + 18,{align: 'center'});
    }
  };

  let y = 45;
  // FILA 1
  dibujarCuadro(10,y,'N° CLIENTES','',false);
  dibujarCuadro(75,y,'DEBE ENTREGAR','',false);
  dibujarCuadro(140,y,'MULTAS','',false);
  y += 32;
  // FILA 2
  dibujarCuadro(10,y,'N° CLIENTES AD','',false);
  dibujarCuadro(75,y,'ADELANTOS/DEPÓSITOS','',false);
  dibujarCuadro(140,y,'ATRASO','',false);
  y += 32;
  // FILA 3
  dibujarCuadro(10,y,'ADELANTOS','',false);
  dibujarCuadro(75,y,'AD DEPOSITADO','',false);
  dibujarCuadro(140,y,'TOTAL A ENTREGAR','',false);

  y += 42;

  // FILA 1
  dibujarCuadro(10,y,'DEBE ENTREGAR',`$ ${totalExpected.toFixed(2)}`);
  dibujarCuadro(75,y,'ENTREGÓ',`$ ${totalCollected.toFixed(2)}`);
  dibujarCuadro(140,y,'PORCENTAJE',`${collectionPercentage}%`);
  y += 32;
  // FILA 2
  dibujarCuadro(10,y,'COMISIÓN %',`${commissionPercentage}%`);
  dibujarCuadro(75,y,'COMISIÓN',`$ ${collectionRate.toFixed(2)}`);
  dibujarCuadro(140,y,'MULTAS',`$ ${collectionExpenses.toFixed(2)}`);
  y += 32;
  // FILA 3
  dibujarCuadro(10,y,'EXTRAS',`$ ${extras.toFixed(2)}`);
  dibujarCuadro(75,y,'CRÉDITOS',`${numberCredits}`);
  doc.setDrawColor(0);
  doc.roundedRect(140,y,55,26,2,2);
  doc.setFillColor(30,55,100);
  doc.rect(140,y,55,8,'F');
  doc.setFont('helvetica','bold');
  doc.setFontSize(10);
  doc.setTextColor(255);
  doc.text('COMISIÓN TOTAL',167.5,y + 5.5,{align: 'center'});
  // Total final
  doc.setTextColor(0,120,0);
  doc.setFontSize(16);
  doc.text(`$ ${totalAmount.toFixed(2)}`,167.5,y + 18,{align: 'center'});
  doc.save(`${nombreArchivo}_${fecha}.pdf`);
}

}