import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, of, startWith } from 'rxjs';
import { Zone } from '../../../models/Zone';
import { ClientService } from '../../../core/services/client.service';
import { ZoneService } from '../../../core/services/zone.service';

@Component({
  selector: 'app-search-bar-zone',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, AsyncPipe, MatIconModule],
  templateUrl: './search-bar-zone.component.html',
  styleUrl: './search-bar-zone.component.css'
})
export class SearchBarZoneComponent {
  myControl = new FormControl(''); //Control que se conecta con el input para escuchar los cambios
  options: Zone[] = []; //Guarda las zonas de la petición (sin filtrar)
  filteredOptions: Observable<Zone[]> = of([]); //Esta es la lista filtrada, dependiendo de lo que teclee el usuario

  @Output() selectedZone = new EventEmitter<Zone>(); //Emite la zona seleccionada para usar en el componente padre

  constructor(private clientService: ClientService, private zonaService: ZoneService) {}

  ngOnInit() {
    this.zonaService.getZones().subscribe({
      next: (zones: Zone[]) => {
        this.options = zones;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? this._filter(value) : this.options)
        );
      },
      error: (error) => {
        console.error('Error al cargar zonas.', error);
      }
    });
  }

  //Convierte el objeto zone (idZona - codigoZona) a string
  displayFn(zone: Zone): string {
    return zone && zone.codigoZona ? zone.codigoZona : '';
  }

  //Filtra las zonas en base a lo que tecleo el usuario
  private _filter(value: string): Zone[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(zone => 
      zone.codigoZona.toLowerCase().includes(filterValue)
    );
  }

  onSelected(zone: Zone) {
    this.selectedZone.emit(zone);
    console.log('Zona seleccionada: ', zone);
  }
}
