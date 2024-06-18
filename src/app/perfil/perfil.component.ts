import { Component } from '@angular/core';
import { UserService } from '../userservice.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  currentUser : any


  constructor(private userService:UserService )
  {
  }

  ngOnInit(){
    this.currentUser = this.userService.getLoggedInUser()
  }

}
