import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralstatscomponentComponent } from './generalstatscomponent.component';

describe('GeneralstatscomponentComponent', () => {
  let component: GeneralstatscomponentComponent;
  let fixture: ComponentFixture<GeneralstatscomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralstatscomponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralstatscomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
