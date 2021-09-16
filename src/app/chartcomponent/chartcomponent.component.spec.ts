import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartcomponentComponent } from './chartcomponent.component';

describe('ChartcomponentComponent', () => {
  let component: ChartcomponentComponent;
  let fixture: ComponentFixture<ChartcomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartcomponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
