import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesssComponent } from './pagesss.component';

describe('PagesssComponent', () => {
  let component: PagesssComponent;
  let fixture: ComponentFixture<PagesssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagesssComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagesssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
