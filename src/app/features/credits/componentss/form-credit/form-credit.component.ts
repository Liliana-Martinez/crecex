import { MatTableModule } from '@angular/material/table';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ClienteConDatos } from '../../../../models/ClienteConDatos';

@Component({
  selector: 'app-form-credit',
  imports: [MatTableModule, FormsModule],
  templateUrl: './form-credit.component.html',
  styleUrl: './form-credit.component.css'
})
export class FormCreditComponent {
 @Input() cliente:ClienteConDatos | null = null
}   