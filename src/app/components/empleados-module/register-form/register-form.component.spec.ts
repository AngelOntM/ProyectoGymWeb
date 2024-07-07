import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRegisterFormComponent } from './register-form.component';

describe('RegisterFormComponent', () => {
  let component: EmployeeRegisterFormComponent;
  let fixture: ComponentFixture<EmployeeRegisterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeRegisterFormComponent]
    });
    fixture = TestBed.createComponent(EmployeeRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
