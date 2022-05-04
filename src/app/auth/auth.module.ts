import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    //FormsModule,
    ReactiveFormsModule,
    SharedModule
    
  ],
  exports: [
    LoginComponent
  ]
})
export class AuthModule { }
