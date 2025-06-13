import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-print',
  imports: [],
  templateUrl: './print.component.html',
  styleUrl: './print.component.css'
})
export class PrintComponent {
  @Input() datos: any;
  ngOnInit() {
    console.log('Datos a imprimir:', this.datos);
  } 

}
