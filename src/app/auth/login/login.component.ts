import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from '../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {
  loginForm: FormGroup = this.fb.group({
    username:    ['', [ Validators.required]],
    password: ['', [ Validators.required]],
  });

  constructor( 
    private fb: FormBuilder,
    private router: Router, 
    private authService: AuthService,
  ) { 
    localStorage.clear();
  }


  public login():void {
    const { username, password } = this.loginForm.value;
    this.authService.login( username, password)
    .subscribe(
      {
        next: (respuesta:any) => {
          console.log(respuesta);
            //this.router.navigateByUrl('/layout');
          
        },
        error: (respuestaError:HttpErrorResponse) => {
          console.log(respuestaError);
          /*const respuesta: Respuesta = {...respuestaError.error};
          const codigoHttp : number = respuestaError.status;

          if(codigoHttp !== 0){
            errorAlerta( respuesta.code.toString() , respuesta.message );
          }else{
            errorAlerta( 'Error en el servidor' , AuthService.mensajeErrorDelServidor );
          }*/
        }

      }
    );
  }
}
