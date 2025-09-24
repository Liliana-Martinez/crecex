import { Component } from '@angular/core';
import { SearchBarZoneComponent } from '../../shared/componentes/search-bar-zone/search-bar-zone.component';
import { MatTableModule } from '@angular/material/table';
import { Zone } from '../../models/Zone';
import { CommissionsService } from '../../core/services/commissions.service';
import { FormsModule } from '@angular/forms';
import { SaveButtonComponent } from "../../shared/componentes/save-button/save-button.component";

export interface commissionsData {
  collection: number;      // Gastos de cobranza
  collectionRate: number;  // Comisión
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
  commissionsCol: string[] = ['collection', 'collectionRate', 'numberCredits', 'extras', 'totalAmount'];
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
        collection: resp.totalRecargos,                  // Gastos de cobranza
        collectionRate: resp.comision,                   // Comisión
        numberCredits: resp.total,                       // No de créditos
        extras: resp.cantidad,
        totalAmount: resp.totalRecargos + resp.comision + resp.total // Suma
      };

      // Cargamos en la tabla (tiene que ser array)
      this.dataCommissions = [mapped];
    });
  }
}

