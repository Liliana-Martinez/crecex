import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportCreditsListComponent } from './daily-report-credits-list.component';

describe('DailyReportCreditsListComponent', () => {
  let component: DailyReportCreditsListComponent;
  let fixture: ComponentFixture<DailyReportCreditsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyReportCreditsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyReportCreditsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
