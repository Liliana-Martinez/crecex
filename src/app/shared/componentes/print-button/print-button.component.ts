import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-print-button',
  imports: [],
  templateUrl: './print-button.component.html',
  styleUrl: './print-button.component.css'
})
export class PrintButtonComponent {
  @Input() label: string = 'Imprimir';
  @Input() disabled: boolean = false;

  onPrint() {
    window.print();
  }
}
  