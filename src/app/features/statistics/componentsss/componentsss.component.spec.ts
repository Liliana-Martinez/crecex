import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsssComponent } from './componentsss.component';

describe('ComponentsssComponent', () => {
  let component: ComponentsssComponent;
  let fixture: ComponentFixture<ComponentsssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentsssComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentsssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
