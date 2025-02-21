import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuarantorFormComponent } from './guarantor-form.component';

describe('GuarantorFormComponent', () => {
  let component: GuarantorFormComponent;
  let fixture: ComponentFixture<GuarantorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuarantorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuarantorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
