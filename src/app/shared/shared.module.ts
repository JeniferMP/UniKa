import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import {PipesModule} from './pipes/pipes.module'


@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule
  ], 
  exports:[
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    PipesModule
  ]
})
export class SharedModule { }
