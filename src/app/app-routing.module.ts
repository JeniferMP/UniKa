import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {path:'',redirectTo:'',pathMatch:'full'},
  {path:'**',redirectTo:'/not-found'},
  //{path:'not-found',component:NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],   
  exports: [RouterModule]
})
export class AppRoutingModule { }
