import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Categoria } from 'src/app/models/categoria.model';


@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }

  crearCategoria(nombre:string){
    const url = environment.domain_url + '/api/categoria/insertar';
    const datos = {
      CAT_NOMBRE : nombre
    }     
    return this.http.post<string>(url,datos).pipe( retry(2) );   
  } 

  listarCategoria() : Observable<any>{
    const url = environment.domain_url + '/api/categoria/listarCategorias';
    return this.http.get<any>(url).pipe( retry(2) );
  }

  getUserById(userId : number):Observable<any>{
    const url = environment.domain_url + `/api/usuarios/obtenerUsuario?USU_ID=${userId}`;
    return this.http.get<any>(url).pipe(retry(2));
  }

  
  /*editarCategoria(categoria:Categoria){
    const url = environment.domain_url + '/api/categoria/actualizar';
    const datos = {
      CAT_NOMBRE     : categoria.CAT_NOMBRE,
      CAT_ID         : categoria.CAT_ID,
      IDTIPO_CLIENTE : categoria.IDTIPO_CLIENTE
    }    
    return this.http.put<any>(url,datos).pipe( retry(2));
  }*/
}
