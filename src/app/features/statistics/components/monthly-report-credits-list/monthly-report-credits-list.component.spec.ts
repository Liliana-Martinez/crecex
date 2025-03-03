import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyReportCreditsListComponent } from './monthly-report-credits-list.component';

describe('MonthlyReportCreditsListComponent', () => {
  let component: MonthlyReportCreditsListComponent;
  let fixture: ComponentFixture<MonthlyReportCreditsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyReportCreditsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyReportCreditsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
