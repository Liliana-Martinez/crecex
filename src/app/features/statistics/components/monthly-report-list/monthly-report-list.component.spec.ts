import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyReportListComponent } from './monthly-report-list.component';

describe('MonthlyReportListComponent', () => {
  let component: MonthlyReportListComponent;
  let fixture: ComponentFixture<MonthlyReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyReportListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
