import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EntrenadoresComponent } from './entrenadores/entrenadores.component';
import { InicioComponent } from './inicio/inicio.component';
import { PerfilComponent } from './perfil/perfil.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LayoutComponent } from './layout/layout.component';
import { MembresiasModuleComponent } from './components/membresias-module/membresias-module.component';
import { ProductosModuleComponent } from './components/productos-module/productos-module.component';
import { ProductosComponent } from './productos/productos.component';
import { MembresiasComponent } from './membresias/membresias.component';
import { OrdenModuleComponent } from './components/orden-module/orden-module.component';
import { AddOrdenComponent } from './components/orden-module/add-orden/add-orden.component';
import { DetalleComponent } from './components/orden-module/detalle/detalle.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'Admin', component: LayoutComponent, children: [
    { path: 'membresias', component: MembresiasModuleComponent },
    { path: 'productos', component: ProductosModuleComponent },
    { path: 'ordenes', component: OrdenModuleComponent },
    { path: 'ordenAdd', component: AddOrdenComponent },
    { path: 'ordenesDetalle/:id', component: DetalleComponent },
  ]  },
  { path: 'Home', component: NavbarComponent,children: [
    { path: 'home', component: InicioComponent },
    { path: 'perfil', component: PerfilComponent },
    { path: 'entre', component: EntrenadoresComponent },
    { path: 'productos', component: ProductosComponent },
    { path: 'membresias', component: MembresiasComponent }
  ]},
  { path: '**', redirectTo: 'Home/home' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
