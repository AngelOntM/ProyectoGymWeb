import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroment/enviroment';
import { UserService } from '../userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  private apiURL = environment.apiURL;

  constructor(
    private router: Router,
    private http: HttpClient,
    private session: UserService
  ) {}

  loginUser(): void {
    if (this.email == "" || this.password == "") {
      Swal.fire({
        icon: 'error',
        title: 'Error de formulario',
        text: 'Debes rellenar todos los campos!',
      });
      return;
    }

    if (this.password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Error de formulario',
        text: 'La contraseña debe tener al menos 6 caracteres.',
      });
      return;
    }

    const credentials = { email: this.email, password: this.password };
    Swal.fire({
      title: 'Iniciando sesión...',
      text: 'Por favor, espere.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.post<any>(`${this.apiURL}/login/employee`, credentials).subscribe({
      next: async (response) => {
        if(response.user.rol_id === 1) {
          let verified = false;

          while (!verified) {
            const { value: code } = await Swal.fire({
              title: 'Código 2FA requerido',
              input: 'text',
              inputLabel: 'Ingrese su código 2FA',
              inputPlaceholder: 'Código 2FA',
              showCancelButton: true,
              confirmButtonText: 'Verificar',
              cancelButtonText: 'Cancelar',
              preConfirm: (code) => {
                if (!code) {
                  Swal.showValidationMessage('Debe ingresar un código');
                  return;
                }
                return code;
              }
            });

            if (code) {
              const codeAsInteger = parseInt(code, 10);
              const body = { email:response.user.email, two_factor_code:codeAsInteger };

              Swal.fire({
                title: 'Verificando 2FA...',
                text: 'Por favor espera un momento',
                allowOutsideClick: false,
                didOpen: () => {
                  Swal.showLoading();
                }
              });

              await this.http.post<any>(`${this.apiURL}/verify-2fa`, body).toPromise().then((verifyResponse) => {
                verified = true;  // Mark as verified

                const user = {
                  id: response.user.id,
                  rol: response.user.rol.rol_name,
                  name: response.user.name,
                  token: verifyResponse.token,
                };
                this.session.setLoggedInUser(user);

                Swal.fire({
                  icon: 'success',
                  title: '¡Inicio de sesión exitoso!',
                  text: `Bienvenido ${response.user.name}`,
                  timer: 2500,
                  showConfirmButton: false
                }).then(() => {
                  this.router.navigateByUrl('/home');
                });

              }).catch(async err => {
                await Swal.fire({
                  icon: 'error',
                  title: 'Código incorrecto',
                  text: 'El código 2FA es incorrecto. Inténtalo nuevamente.',
                });
              });
            } else {
              break;
            }
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'No puedes hacer eso',
            text: 'No tienes acceso aqui!!',
          });
        }
      },
      error: (err) => {
        this.http.post<any>(`${this.apiURL}/login/user`, credentials).subscribe({
          next: async (response) => {
            const user = {
              rol: response.user.rol.rol_name,
              name: response.user.name,
              token: response.token,
              telefono: response.user.phone_number,
              email: response.user.email
            };
            this.session.setLoggedInUser(user);

            Swal.fire({
              icon: 'success',
              title: '¡Inicio de sesión exitoso!',
              text: `Bienvenido ${response.user.name}`,
              timer: 2500,
              showConfirmButton: false
            }).then(() => {
              this.router.navigateByUrl('/home');
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error de inicio de sesión',
              text: 'Correo electrónico o contraseña incorrectos',
            });
          }
        });
      }
    });
  }
}
