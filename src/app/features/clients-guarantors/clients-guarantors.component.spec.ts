import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsGuarantorsComponent } from './clients-guarantors.component';

describe('ClientsGuarantorsComponent', () => {
  let component: ClientsGuarantorsComponent;
  let fixture: ComponentFixture<ClientsGuarantorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsGuarantorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsGuarantorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
