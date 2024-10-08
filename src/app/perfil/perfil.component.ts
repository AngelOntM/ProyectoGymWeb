import { Component, ViewChild, OnInit } from '@angular/core';
import { UserService } from '../userservice.service';
import Swal from 'sweetalert2';
import { environment } from '../../enviroment/enviroment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

interface User {
  membership_name: string;
  end_date: string;
}

interface visit {
  user_id: number;
  visit_date: string;
  check_in_time: string;
  user: {
    name: string;
  }
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'] // <-- Corregido styleUrl a styleUrls
})
export class PerfilComponent implements OnInit {

  dataSource: MatTableDataSource<visit>;
  myColumns: string[] = ['visit_date', 'check_in_time'];

  currentUser: any;
  apiURL = environment.apiURL;
  userMember!: User;
  fecha: Date;
  diasRestante: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  visitas: visit[] = [];

  constructor(
    private userService: UserService, 
    private http: HttpClient, 
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<visit>([]);
    this.fecha = new Date();
  }

  ngOnInit() {
    this.currentUser = this.userService.getLoggedInUser();
    this.getUserMember();
    this.getUserVisit();

    // Vincular paginator y sort al dataSource
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getUserMember() {
    this.http.get<any>(`${this.apiURL}/user`, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        this.userMember = response.active_membership || { membership_name: 'N/A', end_date: 'N/A' };
        this.calcularDiferenciaDias();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar el perfil', 'error');
      }
    });
  }

  getUserVisit() {
    this.http.get<any>(`${this.apiURL}/user/visits`, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        this.visitas = response;
        this.visitas.sort((a, b) => {
          const dateA = new Date(a.visit_date + 'T' + a.check_in_time);
          const dateB = new Date(b.visit_date + 'T' + b.check_in_time);
          return dateB.getTime() - dateA.getTime();
        });
        this.dataSource.data = this.visitas;
        
        // VINCULA EL PAGINADOR Y EL ORDENAMIENTO AQUÍ
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar las visitas', 'error');
      }
    });
  }
  

  calcularDiferenciaDias() {
    const endDateString = this.userMember.end_date;
    const endDate = new Date(endDateString);
    const unDia = 24 * 60 * 60 * 1000; // Milisegundos en un día
    const diferencia = Math.abs(endDate.getTime() - this.fecha.getTime());
    this.diasRestante = Math.round(diferencia / unDia);
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
          Swal.showValidationMessage('Por favor, ingresa un código válido de 10 caracteres');
        }
        return { code: code };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.makeRedeem(result.value.code);
      }
    });
  }

  makeRedeem(code: string) {
    const payload = { code: code };
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
        window.location.reload();
      },
      error: (err) => {
        Swal.fire('Error', 'El código es incorrecto, ya fue usado o el usuario ya cuenta con membresía.', 'error');
      }
    });
  }

  changePassword() {
    Swal.fire({
      title: 'Cambiar Contraseña',
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
        '<input id="swal-input2" class="swal2-input" maxlength="10" placeholder="Contraseña actual">' +
        '<input id="swal-input" class="swal2-input" maxlength="10" placeholder="Contraseña nueva">',
      focusConfirm: false,
      preConfirm: () => {
        const pass = (document.getElementById('swal-input2') as HTMLInputElement).value;
        const npass = (document.getElementById('swal-input') as HTMLInputElement).value;
        if (!pass || !npass) {
          Swal.showValidationMessage('Por favor, llenar los campos de forma correcta');
        }
        return { pass: String(pass), npass: String(npass) };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.makeChange(result.value.pass, result.value.npass);
      }
    });
  }

  makeChange(pass: string, npass: string) {
    const payload = {
      current_password: pass,
      new_password: npass,
      new_password_confirmation: npass
    };
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.http.post<any>(`${this.apiURL}/change-password`, payload, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'El cambio fue exitoso.', 'success');
      },
      error: (err) => {
        Swal.fire('Error', 'Por favor, llenar los campos de forma correcta', 'error');
      }
    });
  }

}
