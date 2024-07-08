import { Component } from '@angular/core';
import { UserService } from '../userservice.service';
import Swal from 'sweetalert2';
import { environment } from '../../enviroment/enviroment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  currentUser : any
  apiURL = environment.apiURL


  constructor(private userService:UserService, private http:HttpClient, private router:Router)
  {
  }

  ngOnInit(){
    this.currentUser = this.userService.getLoggedInUser()
  }

  canjear() {
    Swal.fire({
      title: 'Canjear Código',
      html:
      '<style>' +
        'input[type=number]::-webkit-outer-spin-button, ' +
        'input[type=number]::-webkit-inner-spin-button { ' +
          '-webkit-appearance: none; ' +
          'margin: 0; ' +
        '}' +
        'input[type=number] { ' +
          '-moz-appearance: textfield; ' +
        '}' +
      '</style>' +
      '<input id="swal-input2" class="swal2-input" maxlength="10" placeholder="Código">',
      focusConfirm: false,
      preConfirm: () => {
        const code = (document.getElementById('swal-input2') as HTMLInputElement).value;
        if (!code || code.length !== 10) {
          Swal.showValidationMessage('Por favor, ingresa un codigo válido de 10 caracteres');
        }
        return { code: code };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.makeRedeem(result.value.code);
      }
    });
  }

  makeRedeem( code: string) {
    const payload = { code:code }
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.http.post<any>(`${this.apiURL}/membership/redeem`, payload, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'El código ha sido canjeado correctamente.', 'success');
      },
      error: (err) => {
        Swal.fire('Error', 'El código es incorrecto, ya fue usado o el usuario ya cuenta con membresía.', 'error');
      }
    });
  }

}
