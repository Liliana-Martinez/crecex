import { Component } from '@angular/core';
import { SearchBarZoneComponent } from '../../shared/componentes/search-bar-zone/search-bar-zone.component';
import { MatTableModule } from '@angular/material/table';
import { Zone } from '../../models/Zone';
import { CommissionsService } from '../../core/services/commissions.service';

export interface commissionsData {
  collection: number;      // Gastos de cobranza
  collectionRate: number;  // Comisión
  numberCredits: number;   // No de créditos
  totalAmount: number;     // Total (suma)
}

@Component({
  selector: 'app-commissions',
  standalone: true,
  imports: [SearchBarZoneComponent, MatTableModule],
  templateUrl: './commissions.component.html',
  styleUrl: './commissions.component.css'
})
export class CommissionsComponent {
  commissionsCol: string[] = ['collection', 'collectionRate', 'numberCredits', 'totalAmount'];
  dataCommissions: commissionsData[] = [];

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
        totalAmount: resp.totalRecargos + resp.comision + resp.total // Suma
      };

      // Cargamos en la tabla (tiene que ser array)
      this.dataCommissions = [mapped];
    });
  }
}

