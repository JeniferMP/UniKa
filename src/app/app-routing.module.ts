import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {AuthRoutingModule} from './auth/auth-routing.module';

const routes: Routes = [

  {path:'',redirectTo:'',pathMatch:'full'},
  {path:'**',redirectTo:'/not-found'},
  //{path:'not-found',component:NotfoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule],   
  exports: [RouterModule]
})
export class AppRoutingModule { }
