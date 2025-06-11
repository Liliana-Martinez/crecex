import { Component, Input , Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-print-button',
  imports: [],
  templateUrl: './print-button.component.html',
  styleUrl: './print-button.component.css'
})
export class PrintButtonComponent { 
  @Input() label: string = 'Imprimir';
  @Input() disabled: boolean = false;
  @Output() onPrint = new EventEmitter<void>();
  imprimir() {
    this.onPrint.emit();
  }
}
  