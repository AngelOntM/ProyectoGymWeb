import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroment/enviroment';
import { UserService } from '../userservice.service';
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';

interface Membership {
  id: number;
  product_name: string;
  price: number;
  duration_days: number;
  size: number;
  active: boolean;
  discount: number;
  description: string;
  product_image_path: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-membresias',
  templateUrl: './membresias.component.html',
  styleUrls: ['./membresias.component.css']
})
export class MembresiasComponent implements OnInit {

  currentUser: any;
  private apiURL = environment.apiURL;
  imgurl = environment.imgURL;

  private stripe: any;

  membership: Membership[] = [];
  membershipB: Membership[] = [];
  searchTerm: string = '';
  searched: boolean = false;
  errorShown: boolean = false;

  constructor(private http: HttpClient, private userService: UserService) {}

  async ngOnInit() {
    this.currentUser = this.userService.getLoggedInUser();
    this.stripe = await loadStripe('pk_test_51Pc08PLTqA9tmmllvh1GBkYunBiAFmNi8AF0bmEyKAAyhcKBrv1YJFpNfOAX7Tr6Ky0VqODPDlVsoaemqIOMRrrn00xMiBhNCh');
    this.getMbm();
  }

  getMbm() {
    this.http.get<any>(`${this.apiURL}/membresias`).subscribe({
      next: (response) => {
        this.membership = response;
        this.membershipB = response;
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar la lista de membresías', 'error');
      }
    });
  }

  search() {
    this.searched = false;
    this.errorShown = false;

    if (this.searchTerm.trim() === '') {
      this.membership = this.membershipB;
    } else {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      this.membership = this.membershipB.filter(member =>
        member.product_name.toLowerCase().includes(lowerSearchTerm)
      );

      if (this.membership.length === 0 && !this.errorShown) {
        this.searched = true;
        this.errorShown = true;
      }

      if (this.searched) {
        Swal.fire('Error', 'No se encontraron resultados', 'error');
      }
    }
  }

  borrar() {
    this.searchTerm = '';
    this.membership = this.membershipB;
  }

  showMemberDetails(member: Membership) {
    Swal.fire({
      title: member.product_name,
      html: `
        <img 
          src="${member.product_image_path ? this.imgurl + member.product_image_path : '../../assets/img/logo.jpg'}" 
          alt="${member.product_name}" 
          style="width: 30%; margin-bottom: 10px;">
        <p>${member.description}</p>
        <p><strong>Precio:</strong> $${member.price} MXN</p>
      `,
      confirmButtonText: 'Cerrar',
      showCancelButton: true,
      cancelButtonText: 'Pagar con Stripe',
      cancelButtonColor: '#3085d6',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        // Lógica para cerrar el modal
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        // Llamar a tu función de pago de Stripe aquí
        Swal.fire({
          title: 'Cargando...',
          text: 'Por favor espere',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        this.initiatePayment(member.id);
      }
    });
  }

  async initiatePayment(productId: number) {
    try{
      if (this.currentUser.rol === 'Cliente') {
        this.current(productId);
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Eres un administrador, no necesitas membresia',
          icon: 'error', // Puedes usar 'success', 'error', 'warning', 'info', 'question'
          showConfirmButton: true, // Muestra el botón de confirmación
          confirmButtonText: 'Aceptar', // Texto del botón de confirmación
          didOpen: () => {
            Swal.hideLoading(); // Explicitamente esconder cualquier loading
          }
        });
      }
    }
    catch{
      Swal.close();
      Swal.fire({
        title: 'Error',
        text: 'Necesitas iniciar sesion si quires comprar aqui',
        icon: 'error', // Puedes usar 'success', 'error', 'warning', 'info', 'question'
        showConfirmButton: true, // Muestra el botón de confirmación
        confirmButtonText: 'Aceptar', // Texto del botón de confirmación
        didOpen: () => {
          Swal.hideLoading(); // Explicitamente esconder cualquier loading
        }
      });
    }
  }

  current(data: number) {
    this.http.get<any>(`${this.apiURL}/user`, {
      headers: {
        'Authorization': `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        this.haciendoCompra(response, data);
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo realizar la compra', 'error');
      }
    });
  }

  haciendoCompra(client: any, data: number) {
    if (client.active_membership !== null) {
      Swal.fire('Error', 'Ya tienes una membresía activa', 'error');
      console.log(client.active_membership.membership_detail)
    } else {
      this.creandoOrden(client, data);
    }
  }

  creandoOrden(client: any, data: number) {
    const payload = { user_id: client.user.id, product_id: data };
    this.http.post<any>(`${this.apiURL}/orders/memberships`, payload, {
      headers: {
        'Authorization': `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        this.pagandoStripe(response.id);
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo realizar la compra', 'error');
      }
    });
  }

  async pagandoStripe(orderId: number) {
    this.http.post<any>(`${this.apiURL}/orders/${orderId}/create-checkout`, {}, {
      headers: {
        'Authorization': `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: async (response) => {
        Swal.close();
        const { id: sessionId } = response;
  
        // Redirigir al usuario al checkout de Stripe
        const { error } = await this.stripe.redirectToCheckout({
          sessionId: sessionId, // Usar sessionId aquí
        });
  
        if (error) {
          Swal.fire('Error', error.message, 'error');
        }
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo realizar la compra', 'error');
      }
    });
  }
}///Congre we