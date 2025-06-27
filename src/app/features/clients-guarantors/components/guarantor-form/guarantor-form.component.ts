import { Component, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { SaveButtonComponent } from '../../../../shared/componentes/save-button/save-button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GuarantorService } from '../../../../core/services/guarantor.service';
import { Guarantor } from '../../../../models/guarantor';
import { ClientService } from '../../../../core/services/client.service';

@Component({
  selector: 'app-guarantor-form',
  imports: [
    SaveButtonComponent,
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
  guarantorData?: any;
  @Input() modo: 'agregar' | 'modificar' = 'agregar';
  @Input() clientData?: any;
  @Input() selectedOption: string = '';

  showConfirmation: boolean = false;
  dataToSend: any = {};
  modifiedFields = new Map<string, any>();




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

    //this.setGuarantorValues();
  }

  addGuarantor() {
    console.log('Se dio clic a guardar');
    if(this.guarantorForm.invalid) {
      this.errorMessage = 'Debe completar todos los campos.';
      return;
    }

    /*console.log('¿Formulario válido?: ', this.guarantorForm.valid);
    console.log('Errores: ', this.guarantorForm.errors);
    console.log('Valor del formulario: ', this.guarantorForm.value);*/

    const guarantorData: Guarantor = {
      ...this.guarantorForm.value,
      clientId: this.clientService.getClientId()
    };

    /*console.log('Id del ultimo cliente agregado: ', this.clientService.getClientId());
    console.log('Datos del aval con el id del cliente agregado: ', guarantorData);*/
    
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
    this.guarantorData = this.clientData.guarantorDataResult;
    const firstGuarantorData = this.guarantorData[0];
    const secondGuarantorData = this.guarantorData[1]; 
      if (this.selectedOption === 'guarantorp') {
        this.guarantorForm.patchValue({
          name: firstGuarantorData.nombre,
          paternalLn: firstGuarantorData.apellidoPaterno,
          maternalLn: firstGuarantorData.apellidoMaterno,
          age: firstGuarantorData.edad,
          address: firstGuarantorData.domicilio,
          phone: firstGuarantorData.telefono,
          nameJob: firstGuarantorData.trabajo,
          addressJob: firstGuarantorData.domicilioTrabajo,
          colonia: firstGuarantorData.colonia,
          city: firstGuarantorData.ciudad,
          phoneJob: firstGuarantorData.telefonoTrabajo,
          garantias: {
            garantiaUno: firstGuarantorData.garantias.garantiaUno,
            garantiaDos: firstGuarantorData.garantias.garantiaDos,
            garantiaTres: firstGuarantorData.garantias.garantiaTres
          }

        }); 
      } else if (this.selectedOption === 'guarantors') {

        this.guarantorForm.patchValue({
          name: secondGuarantorData.nombre,
          paternalLn: secondGuarantorData.apellidoPaterno,
          maternalLn: secondGuarantorData.apellidoMaterno,
          age: secondGuarantorData.edad,
          address: secondGuarantorData.domicilio,
          phone: secondGuarantorData.telefono,
          nameJob: secondGuarantorData.trabajo,
          addressJob: secondGuarantorData.domicilioTrabajo,
          colonia: secondGuarantorData.colonia,
          city: secondGuarantorData.ciudad,
          phoneJob: secondGuarantorData.telefonoTrabajo,
          garantias: {
            garantiaUno: secondGuarantorData.garantias.garantiaUno,
            garantiaDos: secondGuarantorData.garantias.garantiaDos,
            garantiaTres: secondGuarantorData.garantias.garantiaTres
          }

        });
      }
      this.originalGuarantorFormData = JSON.parse(JSON.stringify(this.guarantorForm.getRawValue()));
      console.log('Datos aplicados en el formulario del aval: ', firstGuarantorData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clientData']) {
      this.setGuarantorValues();
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
  nameJob: 'Trabajo',
  addressJob: 'Domicilio del trabajo',
  phoneJob: 'Teléfono del trabajo',
  garantias: {
    garantiaUno: 'Garantía uno',
    garantiaDos: 'Garantía dos',
    garantiaTres: 'Garantía tres',
  }
};

updateGuarantor(): void {
  const currentValues = this.guarantorForm.getRawValue();
  //const modifiedFields: any = {};
  let idAval: number = 0;

  if (this.selectedOption === 'guarantorp') {
    idAval = this.clientData.guarantorDataResult[0].idAval;
  } else if (this.selectedOption === 'guarantors') {
    idAval = this.clientData.guarantorDataResult[1].idAval;
  }

  for (const key in currentValues) {
    const current = currentValues[key];
    const original = this.originalGuarantorFormData[key];
    const mapValue = this.fieldMap[key];

    if  (typeof current === 'object' && current !== null) {
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

  if (this.modifiedFields.size === 0) {
    console.log('No se realizaron cambios');
    return;
  }

  //Convertir el Map a un objeto para poder enviar
  const modifiedFieldsObject = Object.fromEntries(this.modifiedFields);

  this.dataToSend = {
    id: idAval,
    ...modifiedFieldsObject
  };

  this.showConfirmation = true;
  /*console.log('Confirmación activa:', this.showConfirmation);
  console.log('Datos a enviar al back:', this.dataToSend);*/
 
}

preserverOrder(a: any, b: any): number {
  return 0;
}

getKeyValueObject(obj: any): { [key: string]: any } {
  return obj && typeof obj === 'object' && !Array.isArray(obj) ? obj : {};
}


  confirmUpdate(): void {
  this.guarantorService.updateGuarantor(this.dataToSend).subscribe({
    next: () => {
      console.log('Aval actualizado exitosamente');
      this.showConfirmation = false;
      this.modifiedFields.clear();
      this.dataToSend = {};
      this.guarantorForm.reset();
    },
    error: (err) => {
      console.error('Error al actualizar el aval', err);
      this.showConfirmation = false;
    }
  });
}

cancelUpdate(): void {
  this.showConfirmation = false;
}


}
