import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-save-button',
  imports: [],
  templateUrl: './save-button.component.html',
  styleUrl: './save-button.component.css'
})
export class SaveButtonComponent {
  @Input() label: string = 'Guardar';
  @Input() disabled:  boolean = false;
  @Output() save = new EventEmitter<void>();

onSave() {
  this.save.emit();
}
ngOnChanges() {
  console.log('Label recibido en SaveButtonComponent:', this.label);
}

}
 