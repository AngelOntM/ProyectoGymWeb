import { Component, OnInit } from '@angular/core';
import { UserService } from '../userservice.service';
import { Router } from '@angular/router';
import { environment } from '../../enviroment/enviroment';
import { HttpClient } from '@angular/common/http';
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
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

   apiURL = environment.apiURL
   currentUser : any
   imgurl = environment.imgURL

  productos: Product[] = [];

  constructor(private userService:UserService, private http:HttpClient, private router:Router){

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
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar la lista de productos', 'error');
      }
    });
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

  
  goEspacios(): void {
    this.router.navigate(['/espacios']);
  }
  goNosotros(): void {
    this.router.navigate(['/nosotros']);
  }
  goProducts(): void {
    this.router.navigate(['/productos']);
  }
  goMembres(): void {
    this.router.navigate(['/membresias']);
  }
}
