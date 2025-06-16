import { Component, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { SaveButtonComponent } from '../../../../shared/componentes/save-button/save-button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GuarantorService } from '../../../../core/services/guarantor.service';
import { Guarantor } from '../../../../models/guarantor';
import { ClientService } from '../../../../core/services/client.service';

@Component({
  selector: 'app-guarantor-form',
  imports: [SaveButtonComponent,
            ReactiveFormsModule,
            CommonModule
  ],
  templateUrl: './guarantor-form.component.html',
  styleUrl: './guarantor-form.component.css'
})
export class GuarantorFormComponent implements OnInit {

  guarantorForm!: FormGroup;
  errorMessage: string = '';
  originalGuarantorFormData: any;
  @Input() modo: 'agregar' | 'modificar' = 'agregar';
  @Input() clientData?: any;

  constructor(private guarantorService: GuarantorService, private clientService: ClientService){}

  ngOnInit(): void {
    //Inicializar formulario
    this.guarantorForm = new FormGroup({
      name: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] : []),
      paternalLn: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] : []),
      maternalLn: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] : []),
      age: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.min(18), Validators.max(60)] : []),
      address: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-z0-9\s.,#\-°]+$/)] : []),
      colonia: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] : []),
      city: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] : []),
      phone: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^\d{10}$/)] : []),
      nameJob: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] : []),
      addressJob: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-z0-9\s.,#\-°]+$/)] : []),
      phoneJob: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^\d{10}$/)] : []),
      /**Formulario "anidado" para las garantias */
      garantias: new FormGroup({
        garantiaUno: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] : []),
        garantiaDos: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] : []),
        garantiaTres: new FormControl('', this.modo === 'agregar' ? [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)] : [])
      })
    });

    this.setGuarantorValues();
  }

  addGuarantor() {
    console.log('Se dio clic a guardar');
    if(this.guarantorForm.invalid) {
      this.errorMessage = 'Debe completar todos los campos.';
      return;
    }

    console.log('¿Formulario válido?: ', this.guarantorForm.valid);
    console.log('Errores: ', this.guarantorForm.errors);
    console.log('Valor del formulario: ', this.guarantorForm.value);

    const guarantorData: Guarantor = {
      ...this.guarantorForm.value,
      clientId: this.clientService.getClientId()
    };

    console.log('Id del ultimo cliente agregado: ', this.clientService.getClientId());
    console.log('Datos del aval con el id del cliente agregado: ', guarantorData);
    
    this.guarantorService.addGuarantor(guarantorData).subscribe({
      next: (response) => {
        console.log('Respuesta del back: ', response);
        this.errorMessage = 'Se ha agregado correctamente el aval del cliente.';
      },
      error: (err) => {
        console.log('Error al agregar el aval principal del cliente.', err);
        this.errorMessage = 'No se puedo agregar el aval principal del cliente.'
      }
    });
  }

  private setGuarantorValues(): void {
    if (this.guarantorForm && this.clientData && this.modo === 'modificar') {
      const data = this.clientData.clientData;
      this.guarantorForm.patchValue({
        name: data.name,
        paternalLn: data.paternalLn,
        maternalLn: data.maternalLn,
        age: data.age,
        address: data.addres,
        phone: data.phone,
        nameJob: data.nameJob,
        addresJob: data.addresJob,
        phoneJob: data.phoneJob,
        garantias: {
          garantiaUno: data.garantias.garantiaUno,
          garantiaDos: data.garantias.garantiaDos,
          garantiaTres: data.garantias.garantiaTres
        }

      });
      this.originalGuarantorFormData = JSON.parse(JSON.stringify(this.guarantorForm.getRawValue()));
      console.log('Datos para aplicar el formulario del aval: ', this.clientData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clientData']) {
      this.setGuarantorValues();
    }
  }

  private fieldMap: Record<string, string | Record<string, string>> = {
    name: 'nombre',
    paternalLn:'apellidoPaterno',
    maternalLn: 'apellidoMaterno',
    age: 'edad',
    address: 'domicilio',
    phone: 'telefono',
    nameJob: 'trabajo',
    addresJob: 'domicilioTabajo',
    phoneJob: 'telefonoJob',
    garantias: {
      garantiaUno: 'garantiaUno',
      garantiaDos: 'garantiaDos',
      garantiaTres: 'garantiaTres'
    }
  };

  updateGuarantor(): void {
    const currentValues = this.guarantorForm.getRawValue();
    const modifiedFields: any = {};
    const id = this.clientData.idAval;

    for (const key in currentValues) {
      const current = currentValues[key];
      const original = this.originalGuarantorFormData[key];
      const mapValue = this.fieldMap[key];

      if (typeof current === 'object' && current !== null) {
        const nestedChanges: any = {};
        const nestedFieldMap = typeof mapValue === 'object' ? mapValue: {};

        for (const nestedKey in current) {
          if (current[nestedKey] !== original[nestedKey]) {
            const mappedNestedKey = nestedFieldMap[nestedKey] || nestedKey;
            nestedChanges[mappedNestedKey] = current[nestedKey];
          }
        }
        if (Object.keys(nestedChanges).length > 0) {
          const mappedKey = typeof mapValue === 'string' ? mapValue: key;
          modifiedFields[mappedKey] = nestedChanges;
        }
      } else if (current !== original) {
        const mappedKey = typeof mapValue === 'string' ? mapValue: key;
        modifiedFields[mappedKey] = current;
      }
    }

    if (Object.keys(modifiedFields).length === 0) {
      console.log('no se realizaron cambios');
      return;
    }
    const dataToSend = {
      id: id,
      ...modifiedFields
    };

    this.guarantorService.updateGuarantor(dataToSend).subscribe({
      next: () => console.log('Aval actualizado exitosamente'),
      error: (err) => console.error('Error al actualizar el aval', err)
    });
  }
}
