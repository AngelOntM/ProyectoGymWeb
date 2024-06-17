import { Component } from '@angular/core';
import { UserService } from '../userservice.service';
import { Router } from '@angular/router';
import { environment } from '../../enviroment/enviroment';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  loged : boolean = false
  apiURL = environment.apiURL
  currentUser : any

  constructor(private userService:UserService, private http:HttpClient, private router:Router){

  }

  ngOnInit(){
    if(this.userService.getLoggedInUser() != null)
      {
        this.currentUser = this.userService.getLoggedInUser()
        this.loged = true
      }
      else
      {
        this.loged = false
      }
  }

  logOut(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Hacer la solicitud para cerrar sesión usando el token
        this.http.post<any>(`${this.apiURL}/logout`, null, {
          headers: {
            Authorization: `Bearer ${this.currentUser.token}`
          }
        }).subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Sesión cerrada',
              text: 'Tu sesión ha sido cerrada correctamente.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500 // Tiempo en milisegundos (1.5 segundos)
            }).then(() => {
              this.userService.logout();
              this.router.navigateByUrl('');
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al cerrar sesión',
              text: 'Hubo un problema al intentar cerrar sesión. Por favor, inténtalo de nuevo.',
            }).then(() => {
              this.userService.logout();
              this.router.navigateByUrl('');
            });
          }
        });
      }
    });
  }

}
