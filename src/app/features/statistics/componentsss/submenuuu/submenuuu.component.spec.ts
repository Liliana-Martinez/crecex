import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmenuuuComponent } from './submenuuu.component';

describe('SubmenuuuComponent', () => {
  let component: SubmenuuuComponent;
  let fixture: ComponentFixture<SubmenuuuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmenuuuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmenuuuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
