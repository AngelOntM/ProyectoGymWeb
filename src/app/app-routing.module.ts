import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EntrenadoresComponent } from './entrenadores/entrenadores.component';
import { InicioComponent } from './inicio/inicio.component';
import { PerfilComponent } from './perfil/perfil.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'Admin', component: LayoutComponent, children: [
    { path: 'home', component: InicioComponent },
    { path: 'perfil', component: PerfilComponent },
    { path: 'entre', component: EntrenadoresComponent },
  ]  },
  { path: 'Home', component: NavbarComponent,children: [
    { path: 'home', component: InicioComponent },
    { path: 'perfil', component: PerfilComponent },
    { path: 'entre', component: EntrenadoresComponent },
  ]},
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
