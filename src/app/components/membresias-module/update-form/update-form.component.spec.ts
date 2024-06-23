import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembresiaUpdateFormComponent } from './update-form.component';

describe('UpdateFormComponent', () => {
  let component: MembresiaUpdateFormComponent;
  let fixture: ComponentFixture<MembresiaUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MembresiaUpdateFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MembresiaUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
