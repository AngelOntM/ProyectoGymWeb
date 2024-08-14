import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { environment } from '../../../enviroment/enviroment';
import { UserService } from '../../userservice.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTableFilterModule } from 'ng-mat-table-filter';
import { EmployeeUpdateFormComponent } from './update-form/update-form.component';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  rol_name: string;
  date_of_birth: string;
  rol_id: number;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-empleados-module',
  templateUrl: './empleados-module.component.html',
  styleUrls: ['./empleados-module.component.css'],
  standalone: true,
  imports:[
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatTableFilterModule
  ]
})
export class EmpleadosModuleComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Employee>;
  myColumns: string[] = ['id', 'name', 'phone_number', 'email', 'rol_name', 'actions'];
  currentUser: any;
  private apiURL = environment.apiURL;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  employees: Employee[] = [];

  constructor(private http: HttpClient, private userService: UserService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Employee>([]);
  }

  ngOnInit() {
    this.currentUser = this.userService.getLoggedInUser();
    this.getEmpleados();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getEmpleados() {
    this.http.get<any>(`${this.apiURL}/users/empleados`, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        this.employees = response.empleados;
        this.dataSource.data = this.employees;
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar la lista de empleados', 'error');
      }
    });
  }

  editUser(user: Employee) {
    const dialogRef = this.dialog.open(EmployeeUpdateFormComponent, {
      width: '800px',
      data: user
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateUser(result, user.id);
      }
    });
  }

  deleteUser(user: Employee) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¡No podrás revertir esto!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete<any>(`${this.apiURL}/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${this.currentUser.token}`
          }
        }).subscribe({
          next: (response) => {
            Swal.fire('¡Eliminado!', response.message, 'success');
            this.getEmpleados();
          },
          error: (err) => {
            Swal.fire('Error', err.error.message || 'Ha ocurrido un error', 'error');
          }
        });
      }
    });
  }
  
  addUser(user: Employee) {
    Swal.fire({
      title: 'Registrando empleado...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.post<any>(`${this.apiURL}/register/employee`, user, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        Swal.fire('Empleado registrado', 'El empleado ha sido registrado con éxito', 'success');
        this.getEmpleados();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo registrar el empleado', 'error');
      }
    })
  }

  updateUser(user: Employee, id: any) {
    Swal.fire({
      title: 'Actualizando empleado...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.http.put<any>(`${this.apiURL}/users/admin/`+ id, user,{
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        Swal.fire('Empleado actualizado', 'El empleado ha sido actualizado con éxito', 'success');
        this.getEmpleados();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo actualizar el empleado', 'error');
      }
    })
  }


}
