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
import { DetalleComponent } from './components/orden-module/detalle/detalle.component';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UpdateFormComponent } from './components/clientes-module/update-form/update-form.component';
import { EmployeeUpdateFormComponent } from './components/empleados-module/update-form/update-form.component';
import { VisitasModuleComponent } from './components/visitas-module/visitas-module.component';
import { VisitChartModuleComponent } from './components/visit-chart-module/visit-chart-module.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { OrdenChartModuleComponent } from './components/orden-chart-module/orden-chart-module.component';


@NgModule({
  declarations: [
    MembresiaRegisterFormComponent,
    MembresiaUpdateFormComponent, 
    ProductsRegisterFormComponent, 
    ProductsUpdateFormComponent,
    DetalleComponent,
    OrdenModuleComponent,
    UpdateFormComponent,
    EmployeeUpdateFormComponent,
    VisitasModuleComponent,
    VisitChartModuleComponent,
    OrdenChartModuleComponent
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
    MatDatepickerModule,
    MatCardModule,
    NgxEchartsModule.forRoot({echarts:()=>import('echarts')})
  ],
  exports: [
    //FORMS DE MEMBRESIAS
    MembresiaRegisterFormComponent,
    MembresiaUpdateFormComponent,
    ProductsRegisterFormComponent,
    ProductsUpdateFormComponent,
    UpdateFormComponent,
    EmployeeUpdateFormComponent
    

    //OTROS FORMS
  ],
})
export class RegisterFormModule {}
