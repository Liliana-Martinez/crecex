import { Component, NgModule, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { SaveButtonComponent } from '../../shared/componentes/save-button/save-button.component';
import { CommonModule } from '@angular/common';
import { CreditBureauService } from '../../core/services/credit-bureau.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreditBureau } from '../../models/credit-bureau';

@Component({
  selector: 'app-credit-bureau',
  imports: [RouterModule,
            CommonModule,
            ReactiveFormsModule,
            MatTableModule,
            MatInputModule,
            SaveButtonComponent,
            FormsModule,
            MatFormFieldModule],
  templateUrl: './credit-bureau.component.html',
  styleUrl: './credit-bureau.component.css'
})

export class CreditBureauComponent implements OnInit {
  selectedAction: string = 'add';
  creditBureauForm!: FormGroup;
  errorMessage: string = '';
  searchText: string = '';
  listBureauCol: string[] = ['name', 'address', 'phone'];
  dataSource = new MatTableDataSource<CreditBureau>();

  constructor(private fb: FormBuilder, private creditBureauService: CreditBureauService){}

  ngOnInit(): void {
    //Crear el formulario
    this.creditBureauForm = new FormGroup({
      nameBc: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]),
      addressBc: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s.,#\-°]+$/)]),
      phoneBc: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)])
    });

  }

  //Agregar cliente a buró de crédito
  addToCreditBureau(){
    if (this.creditBureauForm.invalid) {
      this.errorMessage = 'Debe completar todos los campos.';
      return;
    }

    console.log('Datos para enviar al back: ', this.creditBureauForm.value);
    this.creditBureauService.addToCreditBureau(this.creditBureauForm.value).subscribe({
      next: (response) => {
        console.log('Respuesta del back', response);
        this.errorMessage = 'Cliente agregado a buró de crédito correctamente.';
      },
      error: (err) => {
        console.error('Error al agregar el cliente a buró de crédito', err);
        this.errorMessage = 'No se pudo agregar el cliente a buró de crédito.'
      }
    });
  }

  //Buscar cliente en buro de credito
  searchInCreditBureau() {
    console.log('Nombre a enviar al back', this.searchText);
    if (this.searchText.trim().length >= 3) {
      this.creditBureauService.searchByName(this.searchText).subscribe({
        next: (data: any[]) => {
          const mappedData: CreditBureau[] = data.map(item => ({
            name: item.nombre,
            address: item.domicilio,
            phone: item.telefono
          }));
          this.dataSource.data = mappedData;
  
          if (mappedData.length === 0) {
            this.errorMessage = 'El cliente no se encuentra en el buró de crédito.';
          } else {
            this.errorMessage = ''; // Limpiar mensaje anterior si todo salió bien
          }
        },
        error: (error) => {
          console.error('Error al buscar', error);
          this.errorMessage = 'Ocurrió un error al buscar los datos. Intente de nuevo.';
          this.dataSource.data = [];
        }
      });
    } else {
      this.dataSource.data = [];
    }
  }
}
