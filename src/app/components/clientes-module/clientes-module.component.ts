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
import { UpdateFormComponent } from './update-form/update-form.component';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  date_of_birth: string;
  rol_id: number;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-clientes-module',
  templateUrl: './clientes-module.component.html',
  styleUrl: './clientes-module.component.css',
  standalone: true,
  imports:[
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatTableFilterModule,
    CommonModule
  ]
})
export class ClientesModuleComponent implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<User>;
  myColumns: string[] = ['id', 'name', 'phone_number', 'email', 'actions'];
  currentUser: any;
  private apiURL = environment.apiURL;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  users: User[] = [];

  constructor(private http: HttpClient, private userService: UserService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<User>([]);
  }

  ngOnInit() {
    this.currentUser = this.userService.getLoggedInUser();
    this.getClientes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getClientes() {
    this.http.get<any>(`${this.apiURL}/users/clientes`, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        this.users = response.clientes;
        this.dataSource.data = this.users;
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar la lista de clientes', 'error');
      }
    });
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UpdateFormComponent, {
      width: '800px',
      data: user
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateUser(result, user.id);
      }
    });
  }

  deleteUser(user: User) {
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
            this.getClientes();
          },
          error: (err) => {
            Swal.fire('Error', err.error.message || 'Ha ocurrido un error', 'error');
          }
        });
      }
    });
  }

  
  addUser(user: User) {
    Swal.fire({
      title: 'Registrando cliente...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.post<any>(`${this.apiURL}/register/user`, user, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        Swal.fire('Cliente registrado', 'El cliente ha sido registrado con éxito', 'success');
        this.getClientes();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo registrar el cliente', 'error');
      }
    })
  }

  updateUser(user: User, id: any) {
    Swal.fire({
      title: 'Actualizando cliente...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.http.put<any>(`${this.apiURL}/users/`+ id, user,{
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        Swal.fire('Cliente actualizado', 'El cliente ha sido actualizado con éxito', 'success');
        this.getClientes();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo actualizar el cliente', 'error');
      }
    })
  }

}
