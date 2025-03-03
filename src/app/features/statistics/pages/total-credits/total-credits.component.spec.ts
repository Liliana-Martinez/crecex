import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalCreditsComponent } from './total-credits.component';

describe('TotalCreditsComponent', () => {
  let component: TotalCreditsComponent;
  let fixture: ComponentFixture<TotalCreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalCreditsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
