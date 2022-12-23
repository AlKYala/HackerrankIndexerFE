import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowtocomponentComponent } from './howtocomponent.component';

describe('HowtocomponentComponent', () => {
  let component: HowtocomponentComponent;
  let fixture: ComponentFixture<HowtocomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowtocomponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowtocomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
