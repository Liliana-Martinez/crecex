import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmenuStatisticsComponent } from './submenu-statistics.component';

describe('SubmenuStatisticsComponent', () => {
  let component: SubmenuStatisticsComponent;
  let fixture: ComponentFixture<SubmenuStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmenuStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmenuStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
