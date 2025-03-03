import { Component } from '@angular/core';
import { SearchBarZoneComponent } from "../../shared/componentes/search-bar-zone/search-bar-zone.component";
import { PrintButtonComponent } from "../../shared/componentes/print-button/print-button.component";

@Component({
  selector: 'app-collectors',
  imports: [SearchBarZoneComponent, PrintButtonComponent],
  templateUrl: './collectors.component.html',
  styleUrl: './collectors.component.css'
})
export class CollectorsComponent {

}
