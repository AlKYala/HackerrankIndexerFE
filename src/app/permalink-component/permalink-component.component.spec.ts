import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermalinkComponentComponent } from './permalink-component.component';

describe('PermalinkComponentComponent', () => {
  let component: PermalinkComponentComponent;
  let fixture: ComponentFixture<PermalinkComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermalinkComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermalinkComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
