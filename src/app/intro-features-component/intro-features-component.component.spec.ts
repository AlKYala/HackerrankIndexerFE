import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroFeaturesComponentComponent } from './intro-features-component.component';

describe('IntroFeaturesComponentComponent', () => {
  let component: IntroFeaturesComponentComponent;
  let fixture: ComponentFixture<IntroFeaturesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntroFeaturesComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroFeaturesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
