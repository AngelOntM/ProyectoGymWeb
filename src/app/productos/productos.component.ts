import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroment/enviroment';
import { UserService } from '../userservice.service';
import Swal from 'sweetalert2';

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
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {

  currentUser: any;
  private apiURL = environment.apiURL;

  imgurl = environment.imgURL

  productos: Product[] = [];
  productosB: Product[] = [];
  searchTerm: string = '';
  searched: boolean = false;
  errorShown: boolean = false;
  

  constructor(private http: HttpClient, private userService: UserService) {

  }

  ngOnInit() {
    this.currentUser = this.userService.getLoggedInUser();
    this.getPdct();
  }

  getPdct() {
    this.http.get<any>(`${this.apiURL}/productos`, {

    }).subscribe({
      next: (response) => {
        this.productos = response;
        this.productosB = response; 
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar la lista de productos', 'error');
      }
    });
  }

  search() {
    this.searched = false;
    this.errorShown = false; // Añadir una variable para rastrear si el error ya se mostró
  
    if (this.searchTerm.trim() === '') {
      this.productos = this.productosB;
    } else {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      this.productos = this.productosB.filter(member =>
        member.product_name.toLowerCase().includes(lowerSearchTerm)
      );
  
      if (this.productos.length === 0 && !this.errorShown) {
        this.searched = true;
        this.errorShown = true; // Marcar que el error se ha mostrado
      }
  
      if (this.searched) {
        Swal.fire('Error', 'No se encontraron resultados', 'error');
      }
    }
  }

  borrar(){
    this.searchTerm = '';
    this.productos = this.productosB;
  }

  showProductDetails(producto: Product) {
    Swal.fire({
      title: `<h2 style="font-size: 24px; ">${producto.product_name}</h2>`,
      html: `
        <div style="display: flex; align-items: center;">
          <img src="${this.imgurl+producto.product_image_path}" alt="${producto.product_name}" style="width: 150px; height: auto; margin-right: 20px;">
          <div style="text-align: left;">
            <p style="font-size: 16px; margin-bottom: 10px;">${producto.description}</p>
            <p style="font-size: 20px; font-weight: bold; color: #e74c3c;">$${producto.price} MXN</p>
          </div>
        </div>
      `,
      showConfirmButton: false,
      width: '600px',
      padding: '20px',
      background: '#fff',
      backdrop: `rgba(0, 0, 0, 0.4)`,
      customClass: {
        title: 'swal-title-class',
        htmlContainer: 'swal-html-class'
      }
    });
  }
  

}
