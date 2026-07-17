import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCreditsComponent } from './manage-credits.component';

describe('ManageCreditsComponent', () => {
  let component: ManageCreditsComponent;
  let fixture: ComponentFixture<ManageCreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCreditsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
