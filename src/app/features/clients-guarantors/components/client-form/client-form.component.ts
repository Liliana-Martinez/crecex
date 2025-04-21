import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { SaveButtonComponent } from '../../../../shared/componentes/save-button/save-button.component';
import { ClientService } from '../../../../core/services/client.service';
import { Client } from '../../../../models/Client';
import { Zone } from '../../../../models/Zone';
import { map, Observable, of, startWith } from 'rxjs';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule, 
            CommonModule, 
            SaveButtonComponent, 
            MatAutocompleteModule, 
            MatInputModule, 
            MatFormFieldModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent implements OnInit {

  clientForm!: FormGroup;
  errorMessage: string = '';
  listZones: Zone[] = [];
  filteredZones$: Observable<Zone[]> = of([]);// = new Observable();

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    //Inicializar formulario
    this.clientForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      paternalLn: new FormControl('', [Validators.required]),
      maternalLn: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      colonia: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      classification: new FormControl('', [Validators.required]),
      zone: new FormControl('', [Validators.required]),
      zoneId: new FormControl(''),
      nameJob: new FormControl('', [Validators.required]),
      addressJob: new FormControl('', [Validators.required]),
      phoneJob: new FormControl('', [Validators.required]),
      nameReference: new FormControl('', [Validators.required]),
      addressReference: new FormControl('', [Validators.required]),
      phoneReference: new FormControl('', [Validators.required]),

      /**Formulario anidado, es decir garantiasForm dentro de ClientForm */
      garantias: new FormGroup({
        garantiaUno: new FormControl('', [Validators.required]),
        garantiaDos: new FormControl('', [Validators.required]),
        garantiaTres: new FormControl('', [Validators.required])
      })
    });
    this.getZones();
    this.filteredZones$ = this.clientForm.get('zone')!.valueChanges.pipe(
      startWith(''),
      map(value => value ? this.filterZones(value) : this.listZones)
    );
  }


  //Obtener la lista de las zonas
  private getZones() {
    this.clientService.getZones().subscribe((zones: Zone[]) => {
      this.listZones = zones;
    });
    this.filteredZones$ = of(this.listZones);
  }

  onZoneSelected(zoneCode: string) { //Recibe A-3
    const selectedZone = this.listZones.find(z => {
      return z.codigoZona.toLowerCase() === zoneCode.toLowerCase(); 
    }); //Si funciona se supone que selectedZone = 3-A
    if(selectedZone) {
      this.clientForm.get('zoneId')?.setValue(selectedZone.id);
    }
  }

  private filterZones(value: string): Zone[] {
    const filterValue = value.toLowerCase();
    return this.listZones.filter(z => z.codigoZona.toLowerCase().includes(filterValue));
  }

  addClient() {
    const zoneCode = this.clientForm.get('zone')?.value;
    this.onZoneSelected(zoneCode); //Se envía ejemplo A-3
    
    if (this.clientForm.invalid) {
      this.errorMessage = 'Bebe completar todos los campos.';
      return;
    }

    const clientData: Client = this.clientForm.value;
    this.clientService.addClient(clientData).subscribe({
      next: (response) => {
        console.log('Respuesta del backend', response);
        this.errorMessage = 'Cliente y garantias agregados correctamente.';
      },
      error: (err) => {
        console.error('Error al agregar el cliente.', err);
        this.errorMessage = 'Error: no se pudo agregar el cliente.'
      }
    });
  }
}
