import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarWithoutLoginComponent } from './navbar-without-login.component';

describe('NavbarWithoutLoginComponent', () => {
  let component: NavbarWithoutLoginComponent;
  let fixture: ComponentFixture<NavbarWithoutLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarWithoutLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarWithoutLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
