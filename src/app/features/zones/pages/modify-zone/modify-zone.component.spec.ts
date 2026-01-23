import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyZoneComponent } from './modify-zone.component';

describe('ModifyZoneComponent', () => {
  let component: ModifyZoneComponent;
  let fixture: ComponentFixture<ModifyZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyZoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
