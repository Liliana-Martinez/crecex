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
import { ZoneService } from '../../../../core/services/zone.service';

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
  
  originalClientFormData: any;
  listZones: Zone[] = [];
  filteredZones$: Observable<Zone[]> = of([]);// = new Observable();
  @Input() modo: 'agregar' | 'modificar' = 'agregar';
  @Input() clientData?: any; //Datos que se recibiran para llenar el formulario en modificar, era tipo Client
  
  dataToSend: any = {};
  modifiedFields = new Map<string, any>();
  showSuccessModal = false; //Variable para relacionar el modal
  successMessage = ''; //Variable para relacionar el modal

  showErrorModal = false;
  errorMessage: string = '';

  showConfirmation = false;

  constructor(private clientService: ClientService, private zonaService: ZoneService) {}

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
      points: new FormControl({ value : this.modo === 'agregar' ? 0 : '', disabled: this.modo === 'agregar'}, []), //****** */
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

    //this.setClientValues();
  }

  addClient() {
    const zoneCode = this.clientForm.get('zone')?.value;
    this.onZoneSelected(zoneCode); //Se envía ejemplo A-3
    
    console.log('¿Formulario aval válido?: ', this.clientForm.valid);
    console.log('Errores: ', this.clientForm.errors);
    console.log('Valor del formulario: ', this.clientForm.value);

    if (this.clientForm.invalid) {
      this.errorMessage = 'Debe completar todos los campos.';
      this.showErrorModal = true;
      return;
    }

    const clientData: Client = this.clientForm.value;
    this.clientService.addClient(clientData).subscribe({
      next: (response) => {
        console.log('Respuesta del backend', response);
        //Guardar el id del cliente para agregar sus avales
        const clientId = response.clientId;
        this.clientService.setClientId(clientId);
        
        //Mostrar el modal de exito
        this.successMessage = 'Se agrego correctamente el cliente y sus garantias.';
        this.showSuccessModal = true;

        //Limpiar el formulario
        this.clientForm.reset({
          points: 0
        });
      },
      error: (err) => {
        //console.error('Error al agregar el cliente.', err);
        if (err.status === 409 && err.error && err.error.message === 'El cliente ya existe.') {
          this.errorMessage = 'El cliente ya existe.';
          this.showErrorModal = true;
        } else {
          this.errorMessage = 'No se pudo agregar el cliente.';
          this.showErrorModal =  true;
        }
      }
    });
  }

  //Obtener la lista de las zonas
  private getZones() {
    this.zonaService.getZones().subscribe((zones: Zone[]) => {
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

  //Cerrar el modal  de exito
  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  //Cerrar el modal  de fallo
  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  //Codigo para modificar en el submenu de clientes-avales
private setClientValues(): void {
    if (this.clientForm && this.clientData && this.modo === 'modificar') {
      const data = this.clientData.clientData; //Variable de aqui, lo del back
      this.clientForm.patchValue({
        name: data.name,
        paternalLn: data.paternalLn,
        maternalLn: data.maternalLn,
        age: data.age,
        address: data.address,
        colonia: data.colonia,
        city: data.city,
        phone: data.phone,
        classification: data.classification,
        zone: data.zone,
        points: data.points,/*********** */
        nameJob: data.nameJob,
        addressJob: data.addressJob,
        phoneJob: data.phoneJob,
        nameReference: data.nameReference,
        addressReference: data.addressReference,
        phoneReference: data.phoneReference ,
        garantias: {
          garantiaUno: data.garantias.garantiaUno,
          garantiaDos: data.garantias.garantiaDos,
          garantiaTres: data.garantias.garantiaTres,
        }
      }
      );
      this.originalClientFormData = JSON.parse(JSON.stringify(this.clientForm.getRawValue()));
      console.log('Datos aplicados en el formulario: ', this.clientData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clientData']) {
      this.setClientValues();
    }
  }

  public fieldMap: Record<string, string | Record<string, string>> = {
    name: 'Nombre',
    paternalLn: 'Apellido paterno',
    maternalLn: 'Apellido materno',
    age: 'Edad',
    address: 'Domicilio',
    colonia: 'Colonia',
    city: 'Ciudad',
    phone: 'Teléfono',
    classification: 'Clasificación',
    zone: 'Zona',
    points: 'Puntos',
    nameJob: 'Trabajo',
    addressJob: 'Domicilio del trabajo',
    phoneJob: 'Teléfono del trabajo',
    nameReference: 'Nombre de la referencia',
    addressReference: 'Domicilio de la referencia',
    phoneReference: 'Teléfono de la referencia',
    garantias: {
      garantiaUno: 'Garantía uno',
      garantiaDos: 'Garantía dos',
      garantiaTres: 'Garantía tres',
    }
};

updateClient(): void {
  const currentValues = this.clientForm.getRawValue();

  if (!this.clientData || !this.clientData.idCliente) {
    this.errorMessage = 'Primero debe buscar un cliente.';
    this.showErrorModal = true;
    return;
  }

  const id = this.clientData.idCliente;
  console.log('ID del cliete que se va a modificar:', id);

  for (const key in currentValues) {
    const current = currentValues[key];
    const original = this.originalClientFormData[key];
    const mapValue = this.fieldMap[key];

    if (typeof current === 'object' && current !== null) {
      const nestedChanges: any = {};
      const nestedFieldMap = typeof mapValue === 'object' ? mapValue : {};

      for (const nestedKey in current) {
        if (current[nestedKey] !== original[nestedKey]) {
          const mappedNestedKey = nestedFieldMap[nestedKey] || nestedKey;
          nestedChanges[mappedNestedKey] = current[nestedKey];
        }
      }

      if (Object.keys(nestedChanges).length > 0) {
        const mappedKey = typeof mapValue === 'string' ? mapValue : key;
        this.modifiedFields.set(mappedKey, nestedChanges);
      }

    } else if (current !== original) {
      const mappedKey = typeof mapValue === 'string' ? mapValue : key;
      this.modifiedFields.set(mappedKey, current);
    }
  }

  console.log('Datos modificados en este punto: ', this.modifiedFields);
  if (this.modifiedFields.size === 0) {
    console.log('No se realizaron cambios.');
    this.errorMessage = 'No se realizaron cambios.'
    this.showErrorModal = true;
    this.clientForm.reset(); //Limpiar el formulario si dio clic en actualizar pero no se modifico ningun campo
    return;
  }

  //Convertir el map a un objeto para poder enviar
  const modifiedFieldsObject = Object.fromEntries(this.modifiedFields);

  this.dataToSend = {
    id: id,
    ...modifiedFieldsObject
  };

  this.showConfirmation = true;
}

preserverOrder(a: any, b: any): number {
  return 0;
}

getKeyValueObject(obj: any): { [key: string]: any } {
  return obj && typeof obj === 'object' && !Array.isArray(obj) ? obj : {};
}

confirmUpdate(): void {
  this.clientService.updateClient(this.dataToSend).subscribe({
    next: () => {
      console.log('Cliente actualizado exitosamente');
      this.showConfirmation = false;
      this.modifiedFields.clear();
      this.dataToSend = {};
      this.clientForm.reset();
      this.successMessage = 'Cliente actualizado exitosamente.';
      this.showSuccessModal = true;
    },
    error: (err) => {
      console.error('Error al actualizar cliente:', err);
      this.showConfirmation = false;
    }
  });
}

cancelUpdate(): void {
  this.showConfirmation = false;
}
}