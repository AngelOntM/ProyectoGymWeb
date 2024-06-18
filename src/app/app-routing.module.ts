import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EntrenadoresComponent } from './entrenadores/entrenadores.component';
import { InicioComponent } from './inicio/inicio.component';
import { PerfilComponent } from './perfil/perfil.component';

const routes: Routes = [
  { path: 'log', component: LoginComponent},
  { path: '', component: InicioComponent},
  { path: 'entre', component: EntrenadoresComponent},
  { path: 'perfil', component: PerfilComponent}
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
