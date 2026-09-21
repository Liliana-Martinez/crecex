import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
import { FORM_VALIDATORS } from '../../constants/form-validators';
import { NormalizationService } from '../../../../core/services/normalization.service';

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
  
  @Input() option: 'create' | 'update' = 'create';
  @Input() clientData?: any; //Datos que se recibiran para llenar el formulario en modificar, era tipo Client
  @Output() clientCreated = new EventEmitter<number>();

  filteredZones$: Observable<Zone[]> = of([]);
  modifiedFields = new Map<string, any>();
  clientForm!: FormGroup;
  originalClientData: any;
  listZones: Zone[] = [];
  dataToSend: any = {};
  showSuccessModal = false; 
  successMessage = ''; 
  showErrorModal = false;
  errorMessage: string = '';
  showConfirmation = false;

  constructor(
    private clientService: ClientService, 
    private zonaService: ZoneService,
    private normalizationService: NormalizationService) {}

  ngOnInit(): void {
    this.initForm();
    this.getZones();
    this.filteredZones$ = this.clientForm.get('zone')!.valueChanges.pipe(
      startWith(''),
      map(value => value ? this.filterZones(value ?? '') : this.listZones)
    );
  }

  initForm(): void {
    this.clientForm = new FormGroup({
      name: new FormControl('', FORM_VALIDATORS.NAME),
      paternalLn: new FormControl('', FORM_VALIDATORS.NAME),
      maternalLn: new FormControl('', FORM_VALIDATORS.NAME),
      age: new FormControl('', [Validators.required, Validators.min(18), Validators.max(60)]),
      address: new FormControl('', FORM_VALIDATORS.ADDRESS),
      colonia: new FormControl('', FORM_VALIDATORS.NAME),
      city: new FormControl('', FORM_VALIDATORS.NAME),
      phone: new FormControl('', FORM_VALIDATORS.PHONE),
      classification: new FormControl('', FORM_VALIDATORS.CLASSIFICATION),
      zone: new FormControl('', [Validators.required]),
      points: new FormControl(
        { 
          value : this.option === 'create' ? 0 : '', 
          disabled: this.option === 'create'
        },
        this.option === 'update' ? [Validators.required] : []),
      zoneId: new FormControl(''),
      jobName: new FormControl('', FORM_VALIDATORS.NAME),
      workAddress: new FormControl('', FORM_VALIDATORS.ADDRESS),
      workPhone: new FormControl('', FORM_VALIDATORS.PHONE),
      referenceName: new FormControl('', FORM_VALIDATORS.NAME),
      referenceAddress: new FormControl('', FORM_VALIDATORS.ADDRESS),
      referencePhone: new FormControl('', FORM_VALIDATORS.PHONE), 
      /*Formulario anidado*/
      collateral: new FormGroup({
        firstCollateral: new FormControl('', FORM_VALIDATORS.NAME),
        secondCollateral: new FormControl('', FORM_VALIDATORS.NAME),
        thirdCollateral: new FormControl('', FORM_VALIDATORS.NAME)
      })
    });
  }

  createClient() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      this.errorMessage = 'Debe completar todos los campos';
      this.showErrorModal = true;
      return;
    }

    const zoneCode = this.clientForm.get('zone')?.value;
    const selectedZone = this.getZoneByCode(zoneCode);
    if (!selectedZone) {
      this.errorMessage = 'Debe seleccionar una zona válida.';
      this.showErrorModal = true;
      return;
    }
  
    //Desestructura lo del formulario en datos personales y garantias
    const { collateral, zone, ...personalData } = this.clientForm.value;
    personalData.zoneId = selectedZone.id;

    const normalizePersonalData = this.normalizationService.normalizePersonalData(personalData);

    const normalizeCollateral = this.normalizationService.normalizeCollateral(collateral);

    const clientData: Client = {
      personalData: normalizePersonalData,
      collateral: normalizeCollateral
    };

    this.clientService.addClient(clientData).subscribe({
      next: (response) => {
        //Guardar el id del cliente para agregar sus avales
        const clientId = response.clientId;
        this.clientCreated.emit(clientId);
        
        //Mostrar el modal de exito
        this.successMessage = 'Se agrego correctamente el cliente y sus garantias';
        this.showSuccessModal = true;

        //Limpiar el formulario
        this.clientForm.reset({
          points: 0
        });
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage = err.error.message;
          this.showErrorModal = true;
        } else {
          this.errorMessage = err.error.message;
          this.showErrorModal =  true;
        }
      }
    });
  }

  //Petición para obtener la lista de las zonas
  getZones() {
    this.zonaService.getZones().subscribe((zones: Zone[]) => {
      this.listZones = zones;
    });
  }

  //Devolver las zonas que coincidan con lo que ingresa el usuario
  private filterZones(value: string): Zone[] {
    const filterValue = (value ?? '').toLowerCase();
    return this.listZones.filter(z => z.codigoZona.toLowerCase().includes(filterValue));
  }

  //Asignar id dependiendo el codigo de la zona
  getZoneByCode(zoneCode: string) { //Recibe A-3
    return this.listZones.find(zone =>
      zone.codigoZona.toLowerCase() === (zoneCode ?? '').toLowerCase() 
    ); //Si funciona se supone que selectedZone = 3-A 
  }

  /*Código para la opción de modificar*/
  //Cargar los datos en el formulario del cliente buscado
  private loadClientDataIntoForm(): void {

    if (this.clientForm && this.clientData && this.option === 'update') {
      
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
        jobName: data.nameJob,
        workAddress: data.addressJob,
        workPhone: data.phoneJob,
        referenceName: data.nameReference,
        referenceAddress: data.addressReference,
        referencePhone: data.phoneReference ,
        collateral: {
          firstCollateral: data.garantias.garantiaUno,
          secondCollateral: data.garantias.garantiaDos,
          thirdCollateral: data.garantias.garantiaTres,
        }
      }
      );
      this.originalClientData = JSON.parse(JSON.stringify(this.clientForm.getRawValue()));
    }
  }

  //Detectar si se busco otro cliente
  ngOnChanges(inputChanges: SimpleChanges): void {
    if (inputChanges['clientData']) {
      if (this.clientData) {
        this.loadClientDataIntoForm();
      } else {
        this.clientForm.reset();
        this.originalClientData = {};
        this.modifiedFields.clear();
        this.dataToSend = {};
      }
    }
  }

  updateClient(): void {

    const currentFormValues = this.clientForm.getRawValue();
    console.log('currentFormValues: ', currentFormValues);

    if (!this.clientData || !this.clientData.idCliente) {
      this.errorMessage = 'Primero debe buscar un cliente';
      this.showErrorModal = true;
      return;
    }

    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      this.errorMessage = 'Hay campos con información inválida o vacía';
      this.showErrorModal = true;
      return;
    }

    const id = this.clientData.idCliente;

    for (const property in currentFormValues) { 
      const currentValue = currentFormValues[property];
      const originalValue = this.originalClientData[property];
      const displayName = this.fieldDisplayNames[property];

      if (typeof currentValue === 'object' && currentValue !== null) {
        const modifiedNestedFields: any = {};
        const nestedDisplayNames = typeof displayName === 'object' ? displayName : {};

        for (const nestedProperty in currentValue) {
          if (currentValue[nestedProperty] !== originalValue[nestedProperty]) {
            const nestedDisplayName = nestedDisplayNames[nestedProperty] || nestedProperty;
            modifiedNestedFields[nestedDisplayName] = currentValue[nestedProperty];
          }
        }

        if (Object.keys(modifiedNestedFields).length > 0) {
          const displayProperty = typeof displayName === 'string' ? displayName : property;
          this.modifiedFields.set(displayProperty, modifiedNestedFields);
        }

      } else if (currentValue !== originalValue) {
        const displayProperty = typeof displayName === 'string' ? displayName : property;
        this.modifiedFields.set(displayProperty, currentValue);
      }
    }

    if (this.modifiedFields.size === 0) {
      console.log('No se realizaron cambios');
      this.errorMessage = 'No se realizaron cambios'
      this.showErrorModal = true;
      return;
    }

    //Convertir el map a un objeto para poder enviar
    const modifiedFieldsObject = Object.fromEntries(this.modifiedFields);
    const{
      collateral: modifiedCollateral,
      ...modifiedClientFields
    } = modifiedFieldsObject;

    this.dataToSend = {
      id: id,
      ...modifiedClientFields
    };

    if (modifiedCollateral) {
      const currentCollateral = currentFormValues.collateral;
      this.dataToSend.collateral = {
        'Garantía uno': currentCollateral.firstCollateral,
        'Garantía dos': currentCollateral.secondCollateral,
        'Garantía tres': currentCollateral.thirdCollateral,
      }
    }

    this.showConfirmation = true;
  }

  //Esto es para que se muestre en el modal lo que se va actualizar
  fieldDisplayNames: Record<string, string | Record<string, string>> = {
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
    jobName: 'Trabajo',
    workAddress: 'Domicilio del trabajo',
    workPhone: 'Teléfono del trabajo',
    referenceName: 'Nombre de la referencia',
    referenceAddress: 'Domicilio de la referencia',
    referencePhone: 'Teléfono de la referencia',
    collateral: {
      firstCollateral: 'Garantía uno',
      secondCollateral: 'Garantía dos',
      thirdCollateral: 'Garantía tres',
    }
  };

  //Para mostrar en el modal segun como edito el usuario
  preserveOrder(a: any, b: any): number {
    return 0;
  }

  //Para las garantias y mostrar en el modal
  getPropertyValueObject(obj: any): { [key: string]: any } {
    return obj && typeof obj === 'object' && !Array.isArray(obj) ? obj : {};
  }

  //Detectar si el usuario edito para la confirmacion de no guardar cambios
  hasUnsavedChanges(): boolean {

    if (!this.originalClientData || Object.keys(this.originalClientData).length === 0) {
      return false;
    }

    const currentFormValues = this.clientForm.getRawValue();

    for (const property in currentFormValues) {
      const currentValue  = currentFormValues[property];
      const originalValue = this.originalClientData[property];

      if (typeof currentValue === 'object' && currentValue !== null) {
        for (const nestedProperty in currentValue) {
          if  (currentValue[nestedProperty] !== originalValue?.[nestedProperty]) {
            return true;
          }
        }
      } else if (currentValue !== originalValue) {
        return true;
      }
    }
    return false;
  }

  confirmUpdate(): void {
    this.clientService.updateClient(this.dataToSend).subscribe({
      next: () => {
        this.showConfirmation = false;
        this.modifiedFields.clear();
        this.dataToSend = {};
        this.clientForm.reset();
        this.originalClientData = {};
        this.successMessage = 'Cliente actualizado exitosamente';
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

  //Cerrar el modal  de exito
  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  //Cerrar el modal  de fallo
  closeErrorModal(): void {
    this.showErrorModal = false;
  }
}