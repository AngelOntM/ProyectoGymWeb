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
import { ProductsRegisterFormComponent } from './register-form/register-form.component';
import { ProductsUpdateFormComponent } from './update-form/update-form.component';

interface Product {
  id: number;
  product_name: string;
  description: string;
  price: number;
  stock: number;
  discount: number;
  active: boolean;
  category_id:number;
  category_name: string;
  product_image_path: string;
}

@Component({
  selector: 'app-productos-module',
  templateUrl: './productos-module.component.html',
  styleUrl: './productos-module.component.css',
  standalone: true,
  imports:[
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatTableFilterModule
  ]
})


export class ProductosModuleComponent implements OnInit, AfterViewInit{

  dataSource: MatTableDataSource<Product>;
  myColumns: string[] = ['product_name', 'description', 'price', 'stock', 'discount', 'active', 'actions'];
  currentUser: any;
  private apiURL = environment.apiURL;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  productos: Product[] = [];

  constructor(private http: HttpClient, private userService: UserService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Product>([]);
  }

  ngOnInit() {
    this.currentUser = this.userService.getLoggedInUser();
    this.getPdct();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getPdct() {
    this.http.get<any>(`${this.apiURL}/productos/all`, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        this.productos = response;
        this.dataSource.data = this.productos;
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar la lista de productos', 'error');
      }
    });
  }

  openAddMbmDialog() {
    const dialogRef = this.dialog.open(ProductsRegisterFormComponent, {
      width: '800px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addPdct(result);
      }
    });
  }

  addPdct(producto: any) {
    Swal.fire({
      title: 'Registrando producto...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.post<any>(`${this.apiURL}/productos`, producto, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        Swal.fire('Producto registrado', 'El producto ha sido registrado con éxito', 'success');
        this.getPdct();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo registrar el producto', 'error');
      }
    })
  }

  editPdct(pdct: Product) {
    const dialogRef = this.dialog.open(ProductsUpdateFormComponent, {
      width: '800px',
      data: pdct
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updatePdct(result, pdct.id);
      }
    });
  }

  updatePdct(pdct: any, id: any) {
    Swal.fire({
      title: 'Actualizando producto...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.http.post<any>(`${this.apiURL}/productos/`+ id, pdct,{
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        Swal.fire('Producto actualizado', 'El producto ha sido actualizado con éxito', 'success');
        this.getPdct();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
      }
    })
  }

  deletePdct(pdct: Product){
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¡No podrás revertir esto!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete<any>(`${this.apiURL}/productos/${pdct.id}`, {
          headers: {
            Authorization: `Bearer ${this.currentUser.token}`
          }
        }).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El producto ha sido eliminado','success');
            this.getPdct();
          },
          error: (err) => {
            Swal.fire('Error', err.error.message || 'Ha ocurrido un error', 'error');
          }
        });
      }
    });
  }

}
