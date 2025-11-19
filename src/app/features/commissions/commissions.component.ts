import { Component } from '@angular/core';
import { SearchBarZoneComponent } from '../../shared/componentes/search-bar-zone/search-bar-zone.component';
import { MatTableModule } from '@angular/material/table';
import { Zone } from '../../models/Zone';
import { CommissionsService } from '../../core/services/commissions.service';
import { FormsModule } from '@angular/forms';
import { SaveButtonComponent } from "../../shared/componentes/save-button/save-button.component";

export interface commissionsData {
  collectionRate: number;  // Comisión
  collectionExpenses: number;      // Gastos de cobranza
  numberCredits: number;   // No de créditos
  extras: number;          // Extras
  totalAmount: number;     // Total (suma)
}

@Component({
  selector: 'app-commissions',
  standalone: true,
  imports: [SearchBarZoneComponent, MatTableModule, FormsModule, SaveButtonComponent],
  templateUrl: './commissions.component.html',
  styleUrl: './commissions.component.css'
})
export class CommissionsComponent {
  commissionsCol: string[] = ['collectionRate', 'collectionExpenses', 'numberCredits', 'extras', 'totalAmount'];
  dataCommissions: commissionsData[] = [];
  filtro: string = '';


  constructor(private commissionsService: CommissionsService) {}

  onZoneSelected(zone: Zone) {
  console.log("Zona recibida del search:", zone);
  console.log("Mandando idZona al back:", zone.id);

  this.commissionsService.getCommissionsByZone(zone.id).subscribe((resp: any) => {
    console.log("Datos del backend:", resp);

    // Mapeamos los datos del back a lo que espera la tabla
    const mapped: commissionsData = {
      collectionExpenses: resp.resultado.collectionExpenses, // Gastos de cobranza
      collectionRate: resp.resultado.collectionRate, // Comisión %
      numberCredits: resp.resultado.numberCredits,   // No. de créditos
      extras: resp.resultado.extras,                 // Extras
      totalAmount: resp.resultado.totalAmount        // Total general
    };

    // Cargamos en la tabla (tiene que ser array)
    this.dataCommissions = [mapped];
  });
}

}

