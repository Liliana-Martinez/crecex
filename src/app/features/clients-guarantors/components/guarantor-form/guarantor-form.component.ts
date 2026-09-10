import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { SaveButtonComponent } from '../../../../shared/componentes/save-button/save-button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GuarantorService } from '../../../../core/services/guarantor.service';
import { Guarantor } from '../../../../models/guarantor';
import { ClientService } from '../../../../core/services/client.service';
import { FORM_VALIDATORS } from '../../constants/form-validators';

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

  @Input() option: 'create' | 'update' = 'create';
  @Input() clientGuarantors?: any; //Avales del cliente que devuelve el buscador
  @Input() selectedForm: string = '';
  @Input() clientId?: number;

  guarantorForm!: FormGroup;
  originalGuarantorData: any;
  guarantorData?: any;
  dataToSend: any = {};
  modifiedFields = new Map<string, any>();
  showSuccessModal = false;
  successMessage = '';
  showErrorModal = false;
  errorMessage = '';
  showConfirmation = false;

  constructor(private guarantorService: GuarantorService, private clientService: ClientService){}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.guarantorForm = new FormGroup({
      name: new FormControl('', FORM_VALIDATORS.NAME),
      paternalLn: new FormControl('', FORM_VALIDATORS.NAME),
      maternalLn: new FormControl('', FORM_VALIDATORS.NAME),
      age: new FormControl('', [Validators.required, Validators.min(18), Validators.max(60)]),
      address: new FormControl('', FORM_VALIDATORS.ADDRESS),
      colonia: new FormControl('', FORM_VALIDATORS.NAME),
      city: new FormControl('', FORM_VALIDATORS.NAME),
      phone: new FormControl('', FORM_VALIDATORS.PHONE),
      jobName: new FormControl('', FORM_VALIDATORS.NAME),
      workAddress: new FormControl('', FORM_VALIDATORS.ADDRESS),
      workPhone: new FormControl('', FORM_VALIDATORS.PHONE),
      collateral: new FormGroup({
        firstCollateral: new FormControl('', FORM_VALIDATORS.NAME),
        secondCollateral: new FormControl('', FORM_VALIDATORS.NAME),
        thirdCollateral: new FormControl('', FORM_VALIDATORS.NAME)
      })
    });
  }

  createGuarantor() {
    if(this.guarantorForm.invalid) {
      this.errorMessage = 'Debe completar todos los campos';
      this.showErrorModal = true;
      return;
    }
    
    if (this.clientId === undefined) {
      this.errorMessage = 'Tiene que agregar un cliente';
      this.showErrorModal = true;
      return;
    } 

    //Desestructurar los datos
    const { collateral, ...personalData } = this.guarantorForm.value;
    personalData.clientId = this.clientId;
    const guarantorData: Guarantor = {
      personalData,
      collateral
    }

    this.guarantorService.addGuarantor(guarantorData).subscribe({
      next: (response) => {
        //Mostrar el modal de exito
        this.successMessage = 'Se agregó correctamente el aval y sus garantías';
        this.showSuccessModal = true;
        //Limpiar el formulario
        this.guarantorForm.reset();
      },
      error: (err) => {
        this.errorMessage = 'No se pudo agregar el aval del cliente.'
        this.showErrorModal = true;
      }
    });
  }

  /**Código para la opción de modificar aval */
  //Cargar los datos en el formulario
  loadGuarantorDataIntoForm(): void {

    if (this.guarantorForm && this.clientGuarantors && this.option === 'update') {
      this.guarantorData = this.clientGuarantors.guarantorData;

      const primaryGuarantor = this.guarantorData[0];
      const secondaryGuarantor = this.guarantorData[1];

      if (this.selectedForm === 'primaryGuarantor') {
        this.guarantorForm.patchValue({
          name: primaryGuarantor.name,
          paternalLn: primaryGuarantor.paternalLn,
          maternalLn: primaryGuarantor.maternalLn,
          age: primaryGuarantor.age,
          address: primaryGuarantor.address,          
          phone: primaryGuarantor.phone,
          jobName: primaryGuarantor.jobName,
          workAddress: primaryGuarantor.workAddress,
          colonia: primaryGuarantor.colonia,
          city: primaryGuarantor.city,
          workPhone: primaryGuarantor.workPhone,
          collateral: {
            firstCollateral: primaryGuarantor.collateral.firstCollateral,
            secondCollateral: primaryGuarantor.collateral.secondCollateral,
            thirdCollateral: primaryGuarantor.collateral.thirdCollateral
          }
        }); 
      } else if (this.selectedForm === 'secondaryGuarantor') {
        if (!secondaryGuarantor) {
          this.errorMessage = 'El cliente no tiene aval secundario';
          this.showErrorModal = true;
          return;
        }
        this.guarantorForm.patchValue({
          name: secondaryGuarantor.name,
          paternalLn: secondaryGuarantor.paternalLn,
          maternalLn: secondaryGuarantor.maternalLn,
          age: secondaryGuarantor.age,
          address: secondaryGuarantor.address,
          phone: secondaryGuarantor.phone,
          jobName: secondaryGuarantor.jobName,
          workAddress: secondaryGuarantor.workAddress,
          colonia: secondaryGuarantor.colonia,
          city: secondaryGuarantor.city,
          workPhone: secondaryGuarantor.workPhone,
          collateral: {
            firstCollateral: secondaryGuarantor.collateral.firstCollateral,
            secondCollateral: secondaryGuarantor.collateral.secondCollateral,              
            thirdCollateral: secondaryGuarantor.collateral.thirdCollateral
          }
        });
      }
        this.originalGuarantorData = JSON.parse(JSON.stringify(this.guarantorForm.getRawValue()));
      }
  }

  //Detectar otra en trada en el buscador
  ngOnChanges(inputChanges: SimpleChanges): void {
    if (inputChanges['clientGuarantors']) {
      if (this.clientGuarantors) {
        this.loadGuarantorDataIntoForm();
      } else {
        this.guarantorForm.reset();
        this.originalGuarantorData = {};
        this.modifiedFields.clear();
        this.dataToSend= {};
      }
    }
  }
   
  //Nombres para mostrar en el modal de confirmación
  fieldDisplayNames: Record<string, string | Record<string, string>> = {
    name: 'Nombre',
    paternalLn: 'Apellido paterno',
    maternalLn: 'Apellido materno',
    age: 'Edad',
    address: 'Domicilio',
    colonia: 'Colonia',
    city: 'Ciudad',
    phone: 'Teléfono',
    jobName: 'Trabajo',
    workAddress: 'Domicilio del trabajo',
    workPhone: 'Teléfono del trabajo',
    collateral: {
      firstCollateral: 'Garantía uno',
      secondCollateral: 'Garantía dos',
      thirdCollateral: 'Garantía tres',
    }
  };

  updateGuarantor(): void {
    const currentFormValues = this.guarantorForm.getRawValue();
    let guarantorId: number = 0;
    this.guarantorData = this.clientGuarantors.guarantorData;

    if (!this.guarantorData) {
      this.errorMessage = 'Primero debe buscar un cliente';
      this.showErrorModal = true;
      return;
    }

    if (this.guarantorForm.invalid) {
      this.guarantorForm.markAllAsTouched();
      this.errorMessage = 'Hay campos con información inválida o vacía';
      this.showErrorModal = true;
      return;
    }

    if (this.selectedForm === 'primaryGuarantor') {
      guarantorId = this.guarantorData[0].guarantorId;
    } else if (this.selectedForm === 'secondaryGuarantor') {
      guarantorId= this.guarantorData[1].guarantorId;
    }

    for (const property in currentFormValues) {
      const currentValue = currentFormValues[property];
      const originalValue = this.originalGuarantorData[property];
      const displayName = this.fieldDisplayNames[property];

      if  (typeof currentValue === 'object' && currentValue !== null) {
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
      this.errorMessage = 'No se realizaron cambios';
      this.showErrorModal = true;
      return;
    }

    //Convertir el Map a un objeto para poder enviar
    const modifiedFieldsObject = Object.fromEntries(this.modifiedFields);

    const {
      collateral: modifiedCollateral,
      ...modifiedClientFields
    } = modifiedFieldsObject;

    this.dataToSend = {
      guarantorId: guarantorId,
      ...modifiedClientFields
    };

    if (modifiedCollateral) {
      const currentCollateral = currentFormValues.collateral;
      this.dataToSend.collateral ={
        'Garantía uno': currentCollateral.firstCollateral,
        'Garantía dos': currentCollateral.secondCollateral,
        'Garantía tres': currentCollateral.thirdCollateral
      }
    }

    this.showConfirmation = true;
  }

  preserveOrder(a: any, b: any): number {
    return 0;
  }

  getPropertyValueObject(obj: any): { [key: string]: any } {
    return obj && typeof obj === 'object' && !Array.isArray(obj) ? obj : {};
  }

  hasUnsavedChanges(): boolean {
    if (!this.originalGuarantorData || Object.keys(this.originalGuarantorData).length === 0){
      return false;
    }

    const currentFormValues = this.guarantorForm.getRawValue();

    for (const property in currentFormValues) {
      const currentValue = currentFormValues[property];
      const originalValue = this.originalGuarantorData[property];

      if (typeof currentValue === 'object' && currentValue !== null) {
        for (const nestedProperty in currentValue) {
          if (currentValue[nestedProperty] !== originalValue?.[nestedProperty]) {
            return true;
          }
        }
      } else if (currentValue !== originalValue) {
        console.log('Si chay cambios');
        return true;
      }
    }
    return false;
  }

  confirmUpdate(): void {
  this.guarantorService.updateGuarantor(this.dataToSend).subscribe({
    next: () => {
      this.showConfirmation = false;
      this.modifiedFields.clear();
      this.dataToSend = {};
      this.guarantorForm.reset();
      this.originalGuarantorData = {};
      this.successMessage = 'Aval actualizado exitosamente';
      this.showSuccessModal = true;
    },
    error: (err) => {
      console.error('Error al actualizar el aval', err);
      this.showConfirmation = false;
    }
  });
  }

  //Cerrar el modal  de exito
  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  cancelUpdate(): void {
    this.showConfirmation = false;
  }
}
