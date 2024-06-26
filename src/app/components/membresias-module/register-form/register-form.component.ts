import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class MembresiaRegisterFormComponent {
  addMbmForm: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<MembresiaRegisterFormComponent>) {
    this.addMbmForm = this.fb.group({
      product_name: ['', [Validators.required, Validators.maxLength(30)]],
      price: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d{1,2})?$/)]],
      description: ['',[Validators.required, Validators.maxLength(200)]],
      discount: ['', [Validators.required, Validators.pattern(/^\d{1,3}$/)]],
      duration_days: ['', [Validators.required, Validators.pattern(/^-?\d+$/)]],
      size: ['', [Validators.required, Validators.pattern(/^-?\d+$/)]],
      active: ['', Validators.required],
      category: [2, Validators.required],
      product_image_path: [null],
    });
  }

  onSubmit(): void {
    if (this.addMbmForm.valid) {
      const formData = { ...this.addMbmForm.value };
      this.dialogRef.close(formData);
    }
  }  

  onClose(): void {
    this.dialogRef.close();
  }
}