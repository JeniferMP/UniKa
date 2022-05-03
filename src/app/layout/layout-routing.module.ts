import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from './layout.component';
import { DahsboardComponent} from './dahsboard/dahsboard.component';

const routes: Routes = [
  {
    path:'',
    component:LayoutComponent,
    children:[
      {path:'dashboard',component:DahsboardComponent}
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
