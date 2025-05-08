import { Component } from '@angular/core';
import { PrintButtonComponent } from "../../shared/componentes/print-button/print-button.component";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SearchBarComponent } from '../../shared/componentes/search-bar-client/search-bar.component';
import { ClienteCollector } from '../../models/ClienteCollector';

export interface Collector {
  name: string;
  address: string;
  phone: string;
  guarantorp: string;
  guarantors: string;
}


@Component({
  selector: 'app-collectors',
  imports: [SearchBarComponent, PrintButtonComponent, MatTableModule],
  templateUrl: './collectors.component.html',
  styleUrl: './collectors.component.css'
})
export class CollectorsComponent {
  modulo: string = 'collectors';
  datosCliente!: ClienteCollector;
  dataCollector = new MatTableDataSource<any>();
<<<<<<< HEAD
  collectorCol: string [] = ['name', 'address', 'phone', 'guarantorp', 'guarantors'];
=======
  collectorCol: string[] = ['name', 'address', 'phone', 'guarantorp', 'guarantors'];
>>>>>>> e5bb78def75ed5555162b3ad5fa9bf66c72fc2f2
  asignarDatos(respuesta: ClienteCollector) {
    this.datosCliente = respuesta;
    console.log('Informacion que llega el Collectors', respuesta);
  }
  
}
