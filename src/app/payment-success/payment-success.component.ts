import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../userservice.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroment/enviroment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent {

  order: any;
  paymentsession: any;
  private apiURL = environment.apiURL;
  currentUser: any;

  constructor(private router: Router, private userService: UserService, private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParamMap.subscribe(params => {
      this.paymentsession = params.get('payment_intent');
      this.order = params.get('order');
    });
    this.currentUser = this.userService.getLoggedInUser();
   }



  ngOnInit(){
    if (this.currentUser) {
      this.regisPago();
    } else {
      Swal.fire('Error', 'Usuario no autenticado', 'error');
      this.goHome();
    }
  }

  regisPago(){
    const payload = {checkout_session_id:this.paymentsession}
    this.http.post<any>(`${this.apiURL}/orders/${this.order}/stripe-payment`, payload,
      {headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }}
    ).subscribe({
      next: (response) => {
      },
      error: (err) => {
        Swal.fire('Error', 'Esta orden ya esta pagada o a ocurrido un error inesperado', 'error');
        this.goHome();
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
