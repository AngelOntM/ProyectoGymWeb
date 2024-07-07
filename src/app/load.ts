import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableFilterModule } from 'ng-mat-table-filter';

import { MembresiaRegisterFormComponent } from './components/membresias-module/register-form/register-form.component';
import { MembresiaUpdateFormComponent } from './components/membresias-module/update-form/update-form.component';
import { ProductsRegisterFormComponent } from './components/productos-module/register-form/register-form.component';
import { ProductsUpdateFormComponent } from './components/productos-module/update-form/update-form.component';
import { OrdenModuleComponent } from './components/orden-module/orden-module.component';
import { AddOrdenComponent } from './components/orden-module/add-orden/add-orden.component';
import { DetalleComponent } from './components/orden-module/detalle/detalle.component';
import { PaymentFormComponent } from './components/orden-module/payment-form/payment-form.component';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RegisterFormComponent } from './components/clientes-module/register-form/register-form.component';
import { UpdateFormComponent } from './components/clientes-module/update-form/update-form.component';
import { EmployeeRegisterFormComponent } from './components/empleados-module/register-form/register-form.component';
import { EmployeeUpdateFormComponent } from './components/empleados-module/update-form/update-form.component';


@NgModule({
  declarations: [
    MembresiaRegisterFormComponent,
    MembresiaUpdateFormComponent, 
    ProductsRegisterFormComponent, 
    ProductsUpdateFormComponent,
    AddOrdenComponent,
    PaymentFormComponent,
    DetalleComponent,
    OrdenModuleComponent,
    RegisterFormComponent,
    UpdateFormComponent,
    EmployeeRegisterFormComponent,
    EmployeeUpdateFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatTableFilterModule,
    MatDatepickerModule
  ],
  exports: [
    //FORMS DE MEMBRESIAS
    MembresiaRegisterFormComponent,
    MembresiaUpdateFormComponent,
    ProductsRegisterFormComponent,
    ProductsUpdateFormComponent,
    PaymentFormComponent,
    RegisterFormComponent,
    UpdateFormComponent,
    EmployeeRegisterFormComponent,
    EmployeeUpdateFormComponent
    

    //OTROS FORMS
  ],
})
export class RegisterFormModule {}
