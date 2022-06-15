import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Compra } from '../models/compra.model';
import { DetalleCompra } from '../models/detalleCompra.model';
import { StorageService } from './storage.service';
// import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class CompraService {

  constructor(private http:HttpClient, private storage: StorageService) { }

  listarCompras(): Observable<any>{
    const url= environment.domain_url+ '/api/compra/listarCompras.php';
    return this.http.get<any>(url).pipe(retry(2));
  }

  listarDetalleCompras(compraId:number): Observable<any>{
    const url= environment.domain_url+  `/api/detallecompra/listarDetallesCompra.php?COMPRA_ID=${compraId} `;
    return this.http.get<any>(url).pipe(retry(2));
  }

  listarDetallePrendas(): Observable<any>{
    const url= environment.domain_url+  '/api/detallePrenda/listarDetalles.php';
    return this.http.get<any>(url).pipe(retry(2));
  }

  registrarCompra(compra:Compra,detalle:DetalleCompra[]):Observable<any>{
    console.log("registrar Compra")
    const url = environment.domain_url + '/api/compra/insertarCompra.php';
    // const fechaActual = this.datePipe.transform(new Date().toLocaleString("en-US", {timeZone: "America/Lima"}), "yyyy-MM-dd");
    const fechaActual = "2022-06-15"
    const compraNueva={
      USU_ID:1, 
      PROV_ID:compra.PROV_ID, 
      COMPROBANTE_ID:compra.COMPROBANTE_ID,
      COMPRA_NUM_COMPROBANTE:compra.COMPRA_NUM_COMPROBANTE,
      COMPRA_FECHA:fechaActual
    }
    const datos = {
      COMPRA:compraNueva,  
      DETALLES_DE_COMPRA:detalle
    }
    return this.http.post<any>(url,datos).pipe(retry(1));
  }
  
//   getUserById(USU_ID : number):Observable<any>{
//     const url = environment.domain_url + `/api/usuarios/obtenerUsuario.php?USU_ID=${USU_ID}`;
//     return this.http.get<any>(url).pipe(retry(2));
//   }

//   updateUser(usuario:Usuario):Observable<any>{
//     const url = environment.domain_url + '/api/usuarios/actualizarUsuario.php';
//     const datos = {
//       USU_ID: usuario.USU_ID,
//       USU_USUARIO : usuario.USU_USUARIO,
//       USU_CONTRASENIA : usuario.USU_CONTRASENIA,
//       USU_NOMBRES : usuario.USU_NOMBRES,
//       USU_APELLIDO_PATERNO : usuario.USU_APELLIDO_PATERNO,
//       USU_APELLIDO_MATERNO : usuario.USU_APELLIDO_MATERNO,
//       USU_SEXO : usuario.USU_SEXO, 
//       USU_DNI : usuario.USU_DNI,
//       USU_CELULAR : usuario.USU_CELULAR,
//       USU_FECHA_NACIMIENTO: usuario.USU_FECHA_NACIMIENTO,
//       USU_DIRECCION : usuario.USU_DIRECCION,
//       USU_EMAIL : usuario.USU_EMAIL,
//       USU_ESTADO : usuario.USU_ESTADO, //Habilitado(1) / Deshabilitado(0) / Cambio de contraseña (2) 
//       ROL_ID :usuario.ROL_ID 
//     }
//     return this.http.put<any>(url,datos).pipe(retry(2));
//   }

//   habilitarInhabilitarUsuarios(USU_ID:number,numeroEstado:number):Observable<any>{
//     const url = environment.domain_url + '/api/usuarios/habilitarInhabilitarUsuarios.php';
//     const datos = {
//       USU_ID: USU_ID,
//       USU_ESTADO: numeroEstado
//     }
//     return this.http.put<any>(url,datos).pipe( retry(2));
//   }

//   updateProfile(usuario:Usuario):Observable<any>{
//     const url = environment.domain_url + '/api/usuarios/actualizarPerfil.php';
//     const datos = {
//       USU_ID: usuario.USU_ID,
//       USU_USUARIO : usuario.USU_USUARIO,
//       USU_CONTRASENIA : usuario.USU_CONTRASENIA,
//       USU_NOMBRES : usuario.USU_NOMBRES,
//       USU_APELLIDO_PATERNO : usuario.USU_APELLIDO_PATERNO,
//       USU_APELLIDO_MATERNO : usuario.USU_APELLIDO_MATERNO,
//       USU_SEXO : usuario.USU_SEXO, 
//       USU_EMAIL : usuario.USU_EMAIL
//     }
//     return this.http.put<any>(url,datos).pipe(retry(2));
//   }
  

}
