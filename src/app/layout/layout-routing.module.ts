import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from './layout.component';
import { DahsboardComponent} from './dahsboard/dahsboard.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { PrendaComponent } from './prenda/prenda.component';
import { ProveedorComponent } from './proveedor/proveedor.component';

const routes: Routes = [
  {
    path:'',
    component:LayoutComponent,
    children:[
      {path:'dashboard',component:DahsboardComponent},
      {path:'usuarios',component:UsuarioComponent},
      {path:'categorias',component:CategoriaComponent},
      {path:'prendas',component:PrendaComponent},
      {path:'proveedor',component:ProveedorComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
