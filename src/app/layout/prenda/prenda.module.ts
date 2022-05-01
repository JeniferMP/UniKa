import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrendaRoutingModule } from './prenda-routing.module';
import { PrendaComponent } from './prenda.component';
import { ModalPrendaComponent } from './components/modal-prenda/modal-prenda.component';
import { PrendaInicioComponent } from './pages/prenda-inicio/prenda-inicio.component';


@NgModule({
  declarations: [
    PrendaComponent,
    ModalPrendaComponent,
    PrendaInicioComponent
  ],
  imports: [
    CommonModule,
    PrendaRoutingModule
  ]
})
export class PrendaModule { }
