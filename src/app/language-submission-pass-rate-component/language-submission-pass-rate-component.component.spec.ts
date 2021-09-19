import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSubmissionPassRateComponentComponent } from './language-submission-pass-rate-component.component';

describe('LanguageSubmissionPassRateComponentComponent', () => {
  let component: LanguageSubmissionPassRateComponentComponent;
  let fixture: ComponentFixture<LanguageSubmissionPassRateComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguageSubmissionPassRateComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSubmissionPassRateComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
