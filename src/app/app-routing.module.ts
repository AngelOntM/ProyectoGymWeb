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
import { DetalleComponent } from './components/orden-module/detalle/detalle.component';
import { ClientesModuleComponent } from './components/clientes-module/clientes-module.component';
import { EmpleadosModuleComponent } from './components/empleados-module/empleados-module.component';
import { VisitasModuleComponent } from './components/visitas-module/visitas-module.component';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', component: NavbarComponent,children: [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', component: InicioComponent },
    { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['Cliente'] } },
    { path: 'entre', component: EntrenadoresComponent },
    { path: 'productos', component: ProductosComponent },
    { path: 'membresias', component: MembresiasComponent },
  ]},
  { path: 'Admin', component: LayoutComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['Admin'] }, children: [
    { path: 'ordenesDetalle', redirectTo: 'ordenes', pathMatch: 'full' },
    { path: 'clientes', component: ClientesModuleComponent },
    { path: 'empleados', component: EmpleadosModuleComponent },
    { path: 'membresias', component: MembresiasModuleComponent },
    { path: 'productos', component: ProductosModuleComponent },
    { path: 'ordenes', component: OrdenModuleComponent },
    { path: 'ordenesDetalle/:id', component: DetalleComponent },
    { path: 'visitas', component: VisitasModuleComponent },
    { path: '**', redirectTo: 'clientes' }
  ]  },
  // { path: 'Home', component: NavbarComponent,children: [
  //   { path: 'home', component: InicioComponent },
  //   { path: 'perfil', component: PerfilComponent },
  //   { path: 'entre', component: EntrenadoresComponent },
  //   { path: 'productos', component: ProductosComponent },
  //   { path: 'membresias', component: MembresiasComponent }
  // ]},
  { path: '**', redirectTo: 'home' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
