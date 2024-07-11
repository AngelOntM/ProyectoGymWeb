import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfileModuleComponent } from './perfile-module.component';

describe('PerfileModuleComponent', () => {
  let component: PerfileModuleComponent;
  let fixture: ComponentFixture<PerfileModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfileModuleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfileModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
