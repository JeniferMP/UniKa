import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http:HttpClient, private storage: StorageService) { }

  listarUsuario(): Observable<any>{
    const url= environment.domain_url+ '/api/usuarios/listarUsuarios.php';
    return this.http.get<any>(url).pipe(retry(2));
  }

  registerUser(usuario:Usuario):Observable<any>{
    const url = environment.domain_url + '/api/usuarios/registrarUsuario.php';
    const datos = {
      
      USU_USUARIO : usuario.USU_USUARIO,
      USU_CONTRASENIA : usuario.USU_CONTRASENIA,
      USU_NOMBRES : usuario.USU_NOMBRES,
      USU_APELLIDO_PATERNO : usuario.USU_APELLIDO_PATERNO,
      USU_APELLIDO_MATERNO : usuario.USU_APELLIDO_MATERNO,
      USU_SEXO : usuario.USU_SEXO, 
      USU_DNI : usuario.USU_DNI,
      USU_CELULAR : usuario.USU_CELULAR,
      USU_FECHA_NACIMIENTO: usuario.USU_FECHA_NACIMIENTO,
      USU_DIRECCION : usuario.USU_DIRECCION,
      USU_EMAIL : usuario.USU_EMAIL,
      USU_ESTADO : 1, //Habilitado(1) / Deshabilitado(0) / Cambio de contraseña (2) 
      ROL_ID :usuario.ROL_ID 
    }
    return this.http.post<any>(url,datos).pipe(retry(1));
  }
  
  getUserById(userId : number):Observable<any>{
    const url = environment.domain_url + `/api/usuarios/buscarUsuario.php?USU_ID=${userId}`;
    return this.http.get<any>(url).pipe(retry(2));
  }

  updateUser(usuario:Usuario):Observable<any>{
    const url = environment.domain_url + '/api/usuarios/actualizarUsuario.php';
    const datos = {
      USU_ID: usuario.USU_ID,
      USU_USUARIO : usuario.USU_USUARIO,
      USU_CONTRASENIA : usuario.USU_CONTRASENIA,
      USU_NOMBRES : usuario.USU_NOMBRES,
      USU_APELLIDO_PATERNO : usuario.USU_APELLIDO_PATERNO,
      USU_APELLIDO_MATERNO : usuario.USU_APELLIDO_MATERNO,
      USU_SEXO : usuario.USU_SEXO, 
      USU_DNI : usuario.USU_DNI,
      USU_CELULAR : usuario.USU_CELULAR,
      USU_FECHA_NACIMIENTO: usuario.USU_FECHA_NACIMIENTO,
      USU_DIRECCION : usuario.USU_DIRECCION,
      USU_EMAIL : usuario.USU_EMAIL,
      USU_ESTADO : usuario.USU_ESTADO, //Habilitado(1) / Deshabilitado(0) / Cambio de contraseña (2) 
      ROL_ID :usuario.ROL_ID 
    }
    return this.http.put<any>(url,datos).pipe(retry(2));
  }

  habilitarInhabilitarUsuarios(USU_ID:number,numeroEstado:number):Observable<any>{
    const url = environment.domain_url + '/api/usuarios/habilitarInhabilitarUsuarios.php';
    const datos = {
      USU_ID: USU_ID,
      USU_ESTADO: numeroEstado
    }
    return this.http.put<any>(url,datos).pipe( retry(2) );
  }

  updateProfile(usuario:Usuario):Observable<any>{
    const url = environment.domain_url + '/api/usuarios/actualizarPerfil.php';
    const datos = {
      USU_ID: usuario.USU_ID,
      USU_USUARIO : usuario.USU_USUARIO,
      USU_CONTRASENIA : usuario.USU_CONTRASENIA,
      USU_NOMBRES : usuario.USU_NOMBRES,
      USU_APELLIDO_PATERNO : usuario.USU_APELLIDO_PATERNO,
      USU_APELLIDO_MATERNO : usuario.USU_APELLIDO_MATERNO,
      USU_SEXO : usuario.USU_SEXO, 
      USU_EMAIL : usuario.USU_EMAIL
    }
    return this.http.put<any>(url,datos).pipe(retry(2));
  }
  

}
