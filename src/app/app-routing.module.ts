import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {AuthRoutingModule} from './auth/auth-routing.module';
import { LayoutRoutingModule } from './layout/layout-routing.module';
import { LayoutComponent } from './layout/layout.component';


const routes: Routes = [

  {path: '',loadChildren: ()=> import('./auth/auth.module').then( m=>m.AuthModule )   },
  //{path: 'layout',loadChildren: ()=> import('./layout/layout.module').then( m=>m.LayoutModule )   },
  {path: 'layout',
  component: LayoutComponent
  },
  {path:'',redirectTo:'',pathMatch:'full'},
  {path:'**',redirectTo:''},
  //{path:'not-found',component:NotfoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    LayoutRoutingModule
    
  ],  
  exports: [RouterModule]
})
export class AppRoutingModule { }
