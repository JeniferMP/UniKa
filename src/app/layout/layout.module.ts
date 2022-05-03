import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { DahsboardComponent } from './dahsboard/dahsboard.component';


@NgModule({
  declarations: [
    LayoutComponent,
    UsuarioComponent,
    DahsboardComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule
  ]
})
export class LayoutModule { }
