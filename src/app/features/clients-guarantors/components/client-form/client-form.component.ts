import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { SaveButtonComponent } from '../../../../shared/componentes/save-button/save-button.component';
import { ClientService } from '../../../../core/services/client.service';
import { Client } from '../../../../models/Client';
import { Zone } from '../../../../models/Zone';
import { map, Observable, of, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [ReactiveFormsModule, 
            CommonModule, 
            SaveButtonComponent, 
            MatAutocompleteModule, 
            MatInputModule, 
            MatFormFieldModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})

export class ClientFormComponent implements OnInit, OnChanges {
  clientForm!: FormGroup;
  errorMessage: string = '';
  listZones: Zone[] = [];
  filteredZones$: Observable<Zone[]> = of([]);// = new Observable();
  @Input() modo: 'agregar' | 'modificar' = 'agregar';
  @Input() clientData?: any; //Datos que se recibiran para llenar el formulario en modificar

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    //Inicializar formulario
    this.clientForm = new FormGroup({
      name: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] : []),
      paternalLn: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] : []),
      maternalLn: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] : []),
      age: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.min(18), Validators.max(60)] : []),
      address: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-z0-9\s.,#\-°]+$/)] : []),
      colonia: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] : []),
      city: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] : []),
      phone: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^\d{10}$/)] : []),
      classification: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Da-d]$/)] :[]),
      zone: new FormControl('', this.modo === 'agregar' ? [Validators.required] :[]),
      zoneId: new FormControl(''),
      nameJob: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] :[]),
      addressJob: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-z0-9\s.,#\-°]+$/)] :[]),
      phoneJob: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^\d{10}$/)] :[]),
      nameReference: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] :[]),
      addressReference: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-z0-9\s.,#\-°]+$/)] :[]),
      phoneReference: new FormControl('', this.modo === 'agregar' ?[Validators.required, Validators.pattern(/^\d{10}$/)] :[]), 

      /**Formulario anidado, es decir garantiasForm dentro de ClientForm */
      garantias: new FormGroup({
        garantiaUno: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] :[]),
        garantiaDos: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] :[]),
        garantiaTres: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] :[])
      })
    });

    this.getZones();
    this.filteredZones$ = this.clientForm.get('zone')!.valueChanges.pipe(
      startWith(''),
      map(value => value ? this.filterZones(value) : this.listZones)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clientData'] && this.clientData && this.modo === 'modificar') {
      if (this.clientForm) {
        this.clientForm.patchValue(this.clientData);
        console.log('Datos en form-client: ', this.clientData);
      } 
    }
  }

  addClient() {
    const zoneCode = this.clientForm.get('zone')?.value;
    this.onZoneSelected(zoneCode); //Se envía ejemplo A-3
    
    console.log('¿Formulario aval válido?: ', this.clientForm.valid);
    console.log('Errores: ', this.clientForm.errors);
    console.log('Valor del formulario: ', this.clientForm.value);

    if (this.clientForm.invalid) {
      this.errorMessage = 'Debe completar todos los campos.';
      return;
    }

    const clientData: Client = this.clientForm.value;
    this.clientService.addClient(clientData).subscribe({
      next: (response) => {
        console.log('Respuesta del backend', response);
        //Guardar el id del cliente para agregar sus avales
        const clientId = response.clientId;
        this.clientService.setClientId(clientId);
        console.log('Id del usuario recien agregado: ', clientId);
        this.errorMessage = 'Cliente y garantias agregados correctamente.';
      },
      error: (err) => {
        console.error('Error al agregar el cliente.', err);
        this.errorMessage = 'Error: no se pudo agregar el cliente.'
      }
    });
  }

  //Obtener la lista de las zonas
  private getZones() {
    this.clientService.getZones().subscribe((zones: Zone[]) => {
      this.listZones = zones;
    });
    this.filteredZones$ = of(this.listZones);
  }

  //Asignar id dependiendo el codigo de la zona
  onZoneSelected(zoneCode: string) { //Recibe A-3
    const selectedZone = this.listZones.find(z => {
      return z.codigoZona.toLowerCase() === zoneCode.toLowerCase(); 
    }); //Si funciona se supone que selectedZone = 3-A
    if(selectedZone) {
      this.clientForm.get('zoneId')?.setValue(selectedZone.id);
    }
  }

  //Buscar la zona
  private filterZones(value: string): Zone[] {
    const filterValue = value.toLowerCase();
    return this.listZones.filter(z => z.codigoZona.toLowerCase().includes(filterValue));
  }

  updateClient() {}
}