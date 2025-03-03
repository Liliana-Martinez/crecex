import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyReportCreditsListComponent } from './weekly-report-credits-list.component';

describe('WeeklyReportCreditsListComponent', () => {
  let component: WeeklyReportCreditsListComponent;
  let fixture: ComponentFixture<WeeklyReportCreditsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyReportCreditsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyReportCreditsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
