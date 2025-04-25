import { Component, NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { SaveButtonComponent } from '../../shared/componentes/save-button/save-button.component';
import { CommonModule } from '@angular/common';

export interface CreditBureau {
  nameBcList: string;
  addressBcList: string;
  phoneBcList: string;
}

const CREDIT_BUREAU_DATA: CreditBureau[] = [
  {nameBcList: 'Juan Pérez', addressBcList: 'Francisco I. Madero 45', phoneBcList: '3414563210'},
];

/**
 * @title Basic use of `<table mat-table>`
 */

@Component({
  selector: 'app-credit-bureau',
  imports: [RouterModule,
            CommonModule,
            ReactiveFormsModule,
            MatTableModule, SaveButtonComponent],
  templateUrl: './credit-bureau.component.html',
  styleUrl: './credit-bureau.component.css'
})

export class CreditBureauComponent {
  selectedAction: string = 'add';
  nameBc = '';
  addressBc = '';
  phoneBc = '';

  listBureauCol: string[] = ['nameBcList', 'addressBcList', 'phoneBcList'];
  dataListBureau = CREDIT_BUREAU_DATA;
}
