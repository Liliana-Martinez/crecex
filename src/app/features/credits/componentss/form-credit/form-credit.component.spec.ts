import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreditComponent } from './form-credit.component';

describe('FormCreditComponent', () => {
  let component: FormCreditComponent;
  let fixture: ComponentFixture<FormCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCreditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
