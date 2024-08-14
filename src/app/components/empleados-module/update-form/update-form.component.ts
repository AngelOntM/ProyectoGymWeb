import { formatDate } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmpleadosModuleComponent } from '../empleados-module.component';

@Component({
  selector: 'app-employee-update-form',
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.css']
})
export class EmployeeUpdateFormComponent {
  updateUserForm: FormGroup;
  name: any;
  email:any;
  phone: any;
  address: any;
  date: any;

  user: any;
  from: any;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeUpdateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: any; from: any }
  ) {
    this.user = data.user;
    this.from = data.from;
    this.updateUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{1,10}$')]],
      address: ['', [Validators.required, Validators.maxLength(60)]],
      date_of_birth: ['', Validators.required],
      rol_id: [{value:'', disabled:this.from}]
    });
  }
    

  

  ngOnInit(){
    this.updateUserForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      phone_number: this.user.phone_number,
      address: this.user.address,
      date_of_birth: this.user.date_of_birth,
      rol_id: this.user.rol_id === 1 ? 1 : 2
    });
  }

  onSubmit(): void {
    if (this.updateUserForm.valid) {
      const dateOfBirthControl = this.updateUserForm.get('date_of_birth');
      if (dateOfBirthControl) {
        const dateOfBirthValue = dateOfBirthControl.value;
        const formattedDate = formatDate(dateOfBirthValue, 'yyyy-MM-dd', 'en-US');
        const formData = { ...this.updateUserForm.value, date_of_birth: formattedDate };
        if (this.from == false) {
          formData.rol_id = this.updateUserForm.value.rol_id;
        }
        this.dialogRef.close(formData);
      } else {
        console.error('El control date_of_birth no está disponible en el formulario.');
      }
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
