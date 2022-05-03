import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { DahsboardComponent } from './dahsboard/dahsboard.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LayoutComponent,
    UsuarioComponent,
    DahsboardComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    FormsModule
  ],exports:[
    SharedModule,
    DahsboardComponent
  ],
})
export class LayoutModule { }
