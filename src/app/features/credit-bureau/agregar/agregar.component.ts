import { Component } from '@angular/core';
import { SaveButtonComponent } from "../../../shared/componentes/save-button/save-button.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-agregar',
  imports: [SaveButtonComponent],
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.css'
})
export class AgregarComponent {

}
