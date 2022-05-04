import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import {MatProgressBar, MatProgressBarModule} from '@angular/material/progress-bar'
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { DahsboardComponent } from './dahsboard/dahsboard.component';
import { SharedModule } from '../shared/shared.module';
import { CategoriaComponent } from './categoria/categoria.component';
import { PrendaComponent } from './prenda/prenda.component';


@NgModule({
  declarations: [
    LayoutComponent,
    UsuarioComponent,
    DahsboardComponent,
    CategoriaComponent,
    PrendaComponent,
  
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    
    
  ],exports:[
    SharedModule,
    DahsboardComponent,
    LayoutComponent,
  ],
})
export class LayoutModule { }
