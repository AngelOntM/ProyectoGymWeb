import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroment/enviroment';
import { UserService } from '../userservice.service';
import Swal from 'sweetalert2';


interface Membership {
  id: number;
  product_name: string;
  price: number;
  duration_days: number;
  size: number;
  active: boolean;
  discount: number;
  descriprion:string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-membresias',
  templateUrl: './membresias.component.html',
  styleUrl: './membresias.component.css'
})
export class MembresiasComponent implements OnInit {

  currentUser: any;
  private apiURL = environment.apiURL;

  membership: Membership[] = [];
  membershipB: Membership[] = [];
  searchTerm: string = '';
  searched: boolean = false;
  errorShown: boolean = false;

  constructor(private http: HttpClient, private userService: UserService) {
  }

  ngOnInit() {
    this.currentUser = this.userService.getLoggedInUser();
    this.getMbm();
  }

  getMbm() {
    this.http.get<any>(`${this.apiURL}/membresias`, {
      headers: {
      }
    }).subscribe({
      next: (response) => {
        this.membership = response;
        this.membershipB = response;
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar la lista de membresias', 'error');
      }
    });
  }

  search() {
    this.searched = false;
    this.errorShown = false; // Añadir una variable para rastrear si el error ya se mostró
  
    if (this.searchTerm.trim() === '') {
      this.membership = this.membershipB;
    } else {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      this.membership = this.membershipB.filter(member =>
        member.product_name.toLowerCase().includes(lowerSearchTerm)
      );
  
      if (this.membership.length === 0 && !this.errorShown) {
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
    this.membership = this.membershipB;
  }



}
