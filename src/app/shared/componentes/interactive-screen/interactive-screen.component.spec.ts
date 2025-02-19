import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveScreenComponent } from './interactive-screen.component';

describe('InteractiveScreenComponent', () => {
  let component: InteractiveScreenComponent;
  let fixture: ComponentFixture<InteractiveScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractiveScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractiveScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
