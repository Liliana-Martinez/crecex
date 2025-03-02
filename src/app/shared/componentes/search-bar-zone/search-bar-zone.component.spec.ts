import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarZoneComponent } from './search-bar-zone.component';

describe('SearchBarZoneComponent', () => {
  let component: SearchBarZoneComponent;
  let fixture: ComponentFixture<SearchBarZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarZoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBarZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
