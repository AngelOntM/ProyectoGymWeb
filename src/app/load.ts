import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

import { MembresiaRegisterFormComponent } from './components/membresias-module/register-form/register-form.component';
import { MembresiaUpdateFormComponent } from './components/membresias-module/update-form/update-form.component';
import { ProductsRegisterFormComponent } from './components/productos-module/register-form/register-form.component';
import { ProductsUpdateFormComponent } from './components/productos-module/update-form/update-form.component';

@NgModule({
  declarations: [
    MembresiaRegisterFormComponent,
    MembresiaUpdateFormComponent, 
    ProductsRegisterFormComponent, 
    ProductsUpdateFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  exports: [
    //FORMS DE MEMBRESIAS
    MembresiaRegisterFormComponent,
    MembresiaUpdateFormComponent,
    ProductsRegisterFormComponent,
    ProductsUpdateFormComponent

    //OTROS FORMS
  ],
})
export class RegisterFormModule {}
