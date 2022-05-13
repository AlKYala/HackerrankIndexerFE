import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDataSelectorComponent } from './user-data-selector.component';

describe('UserDataSelectorComponent', () => {
  let component: UserDataSelectorComponent;
  let fixture: ComponentFixture<UserDataSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDataSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDataSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
