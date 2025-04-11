import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete'; 
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true, // Si no estás utilizando NgModules, usa standalone en Angular 15+
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, MatIconModule, CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @Output() search = new EventEmitter<string>();  // Emite el nombre completo al componente padre

  myControl = new FormControl('');
  filteredOptions: Observable<string[]> | undefined;

  // Opciones estáticas (puedes eliminar esto si quieres consultar desde el backend)
  options: string[] = ['Julio', 'Fatima', 'Erika', 'Ulises'];

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue));
  }

  // Este método se llama cuando se presiona Enter
  onSearchChange(event: any): void {
    const value = event.target.value;
    if (value) {
      this.search.emit(value);  // Emitimos el valor del input para que el padre lo maneje
    }
  }
}
