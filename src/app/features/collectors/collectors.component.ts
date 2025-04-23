import { Component } from '@angular/core';
import { PrintButtonComponent } from "../../shared/componentes/print-button/print-button.component";
import { MatTableModule } from '@angular/material/table';
import { SearchBarComponent } from '../../shared/componentes/search-bar-client/search-bar.component';

export interface Collector {
  name: string;
  address: string;
  phone: string;
  guarantorp: string;
  guarantors: string;
}

const COLLECTOR_DATA: Collector[] = [
  {name: 'Julio Cesar Romero Hernandez', address: 'Juarez # 56', phone: '3411258852', guarantorp: 'Rodrigo Melchor', guarantors: 'Adriana Mendoza'},
];

@Component({
  selector: 'app-collectors',
  imports: [SearchBarComponent, PrintButtonComponent, MatTableModule],
  templateUrl: './collectors.component.html',
  styleUrl: './collectors.component.css'
})
export class CollectorsComponent {
  modulo: string = 'collectors';
  collectorCol: string[] = ['name', 'address', 'phone', 'guarantorp', 'guarantors'];
  dataCollector = COLLECTOR_DATA;
}
