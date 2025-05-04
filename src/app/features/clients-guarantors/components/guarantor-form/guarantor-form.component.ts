import { Component, OnInit } from '@angular/core';
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

  constructor(private guarantorService: GuarantorService, private clientService: ClientService){}

  ngOnInit(): void {
    //Inicializar formulario
    this.guarantorForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]),
      paternalLn: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]),
      maternalLn: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]),
      age: new FormControl('', [Validators.required, Validators.min(18), Validators.max(60)]),
      address: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s.,#\-°]+$/)]),
      colonia: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]),
      city: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
      nameJob: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]),
      addressJob: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s.,#\-°]+$/)]),
      phoneJob: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
      /**Formulario "anidado" para las garantias */
      garantias: new FormGroup({
        garantiaUno: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]),
        garantiaDos: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]),
        garantiaTres: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)])
      })
    });
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
}
