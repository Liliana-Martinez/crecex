import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { SaveButtonComponent } from '../../../../shared/componentes/save-button/save-button.component';
import { ZoneService } from '../../../../core/services/zone.service';
import { Promoter, Supervisor, Zone } from '../../../../models/Zone';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, of, startWith } from 'rxjs';

@Component({
  selector: 'app-zone-form',
  imports: [ReactiveFormsModule, SaveButtonComponent, CommonModule, MatAutocompleteModule, MatInputModule],
  templateUrl: './zone-form.component.html',
  styleUrl: './zone-form.component.css'
})
export class ZoneFormComponent implements OnInit {

  zoneForm!: FormGroup;

  listZones: Zone[] = [];
  promotersList: Promoter[] = [];
  supervisorsList: Supervisor[] = [];

  filteredZones$: Observable<Zone[]> = of([]);
  filteredPromoters$: Observable<Promoter[]> = of([]);
  filteredSupervisors$: Observable<Supervisor[]> = of([]);

  selectedZone: string | null = null;
  showSuccessModal = false;
  showErrorModal = false;
  successMessage = '';
  errorMessage = '';

  constructor(private zoneService: ZoneService) {}

  ngOnInit(): void {
    this.zoneForm = new FormGroup({
      zoneCode: new FormControl('', [Validators.required]),
      promoter: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]),
      supervisor: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)])
    });

    this.getAvailableZones();

    // ZONAS
    this.filteredZones$ = this.zoneForm.get('zoneCode')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterZones(value ?? ''))
    );

    //Promotores
    this.filteredPromoters$ = this.zoneForm.get('promoter')!.valueChanges.pipe(
      startWith(' '),
      map(value => this.filterPromoters(value ?? ''))
    );

    //Supervisores
    this.filteredSupervisors$ = this.zoneForm.get('supervisor')!.valueChanges.pipe(
      startWith(' '),
      map(value => this.filterSupervisors(value ?? ''))
    );
  }

  //Asignar a las listas lo que llega del back
  private getAvailableZones(): void {
    this.zoneService.getAvailableZones().subscribe(response => {
      console.log('response:', response);
      this.listZones = response.availableZones;
      this.promotersList = response.promoters;
      this.supervisorsList = response.supervisors;
      console.log('Lista de supervisores: ', this.supervisorsList)
    });
  }

  // FILTROS
  private filterZones(value: string): Zone[] {
    const filterValue = value.toLowerCase();
    return this.listZones.filter(z =>
      z.codigoZona.toLowerCase().includes(filterValue)
    );
  }

  private filterPromoters(value: string): Promoter[] {
    const filterValue = value.toLowerCase();
    return this.promotersList.filter(p => 
      p.promotor.toLowerCase().includes(filterValue)
    )
  }

  private filterSupervisors(value: string): Supervisor[] {
    const filterValue = value.toLowerCase();
    return this.supervisorsList.filter(s => 
      s.supervisor.toLowerCase().includes(filterValue)
    );
  }

  
  //SELECCIÓN DE ZONA para autorellenar el promotor y supervisor segun sea la zona (Para modificar)
  onZoneSelected(zoneCode: string): void {
    this.selectedZone = zoneCode;
    this.zoneForm.get('zoneCode')?.setValue(zoneCode);
  }

  addZoneData() {
    if (this.zoneForm.invalid) {
       this.errorMessage = 'Debe completar los campos.';
       this.showErrorModal = true;
       return;
    }
    
    const zoneCode = this.zoneForm.get('zoneCode')?.value;
    
    const zoneValidation = this.listZones.some(
      z => z.codigoZona === zoneCode
    );
    
    if(!zoneValidation) {
      this.errorMessage = 'El codigo de la zona tiene que ser valido.';
      this.showErrorModal = true;
      return;
    }

    const zoneData = this.zoneForm.value;

    this.zoneService.addZone(zoneData).subscribe({
      next: () => {
        this.successMessage = 'Se agrego correctamente una nueva zona de trabajo.';
        this.showSuccessModal = true;
        this.zoneForm.reset();
      },
      error: () => {
        console.log('No se agrego correctamente la zona.')
      }
    });    
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



