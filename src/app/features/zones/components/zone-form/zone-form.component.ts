import { Component, Input, OnInit } from '@angular/core';
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

  @Input() modo: 'agregar' | 'modificar' = 'agregar';

  availableZonesList: Zone[] = [];
  assignedZonesList: Zone[] = [];
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

    this.initForm();

    if (this.modo === 'agregar') {
      this.initAddMode();
    } else if (this.modo === 'modificar') {
      this.initModifyMode();
    }
  }

  //Inicializar el formulario
  private initForm(): void {
    this.zoneForm = new FormGroup({
      zoneCode: new FormControl('', [Validators.required]),
      promoter: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]),
      supervisor: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)])
    });
  }

  //Inicializar lo necesario para la opcion "Agregar zona de trabajo"
  private initAddMode(): void {
    this.getZoneFormData();

    // ZONAS
    this.filteredZones$ = this.zoneForm.get('zoneCode')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterAvailableZones(value ?? ''))
    );
    //Promotores
    this.filteredPromoters$ = this.zoneForm.get('promoter')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterPromoters(value ?? ''))
    );
    //Supervisores
    this.filteredSupervisors$ = this.zoneForm.get('supervisor')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterSupervisors(value ?? ''))
    );
  }

  //Inicializar lo necesario para la opcion de "Modificar zona"
  private initModifyMode(): void {
    this.getAssignedZones();

    // ZONAS
    this.filteredZones$ = this.zoneForm.get('zoneCode')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterAssignedZones(value ?? ''))
    );
    //Promotores
    this.filteredPromoters$ = this.zoneForm.get('promoter')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterPromoters(value ?? ''))
    );

  }

  //Asignar a las listas (Para el submodulo de "agregar") los datos que llegan del back
  private getZoneFormData(): void {
    this.zoneService.getAvailableZones().subscribe(response => {
      console.log('response:', response);
      this.availableZonesList = response.availableZones;
      this.promotersList = response.promoters;
      this.supervisorsList = response.supervisors;
      console.log('Lista de supervisores: ', this.supervisorsList)
    });
  }

  //Asignar a la lista los datos que llegan del back (para el submodulo "modificar")
  private getAssignedZones(): void {
    this.zoneService.getAssignedZones().subscribe(response => {
      console.log('response: ', response);
      this.assignedZonesList = response.assignedZones;
    });
  }

  // Filtra la busqueda en la lista de zonas disponibles
  private filterAvailableZones(value: string): Zone[] {
    const filterValue = value.toLowerCase();
    return this.availableZonesList.filter(z =>
      z.codigoZona.toLowerCase().includes(filterValue)
    );
  }

  //Filtra la lista de zonas asignadas
  private filterAssignedZones(value: string): Zone[] {
    const filterValue = value.toLowerCase();
    return this.assignedZonesList.filter(z =>
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

  //SELECCIÓN DE ZONA para autorellenar el promotor y supervisor segun sea la zona (En el submenu "Modificar zona")
  onZoneSelected(zoneCode: string): void {

    if (this.modo !== 'modificar') {
      return;
    }
    
    console.log('Zona seleccionada: ', zoneCode);
    this.selectedZone = zoneCode;
    this.zoneForm.get('zoneCode')?.setValue(zoneCode);

    const zone = this.assignedZonesList.find(
      z => z.codigoZona === zoneCode
    );

    if (!zone) {
      this.errorMessage = 'No se encontro la informacion de la zona.';
      this.showErrorModal = true;
      return;
    }

    this.zoneForm.patchValue({
      promoter: zone.promotor,
      supervisor: zone.supervisor
    });
  }


  addZoneData() {
    if (this.zoneForm.invalid) {
       this.errorMessage = 'Debe completar los campos.';
       this.showErrorModal = true;
       return;
    }
    
    const zoneCode = this.zoneForm.get('zoneCode')?.value;
    
    const zoneValidation = this.availableZonesList.some(
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

  updateZoneData() {
    if (this.zoneForm.invalid) {
      this.zoneForm.markAllAsTouched();
      return;
    }

    const { zoneCode, promoter, supervisor} = this.zoneForm.getRawValue();
    const payload = {
      codigoZona: zoneCode,
      promotor: promoter,
      supervisor: supervisor
    };

    this.zoneService.updateZone(payload).subscribe({
      next: () => {
        this.successMessage = 'Zona actualizada correctamente';
        this.showSuccessModal = true;
      },
      error: (err) => {
        this.errorMessage = 'Error al actualizar la zona';
        this.showErrorModal = true;
        console.error(err);
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