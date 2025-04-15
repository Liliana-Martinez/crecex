import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenewComponent } from './renew.component';
import { FormCreditComponent } from '../../componentss/form-credit/form-credit.component';

describe('RenewComponent', () => {
  let component: RenewComponent;
  let fixture: ComponentFixture<RenewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenewComponent, FormCreditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
