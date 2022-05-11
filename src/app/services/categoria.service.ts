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

  crearCategoria(cat:Categoria){
    const url = environment.domain_url + '/api/categoria/insertar';
    const datos = {
      CAT_NOMBRE : cat.CAT_NOMBRE,
      IDTIPO_CLIENTE : cat.IDTIPO_CLIENTE,
    }     
    return this.http.post<string>(url,datos).pipe( retry(2) );   
  } 

  listarCategoria() : Observable<any>{
    const url = environment.domain_url + '/api/categoria/listarCategoria';
    return this.http.get<any>(url).pipe( retry(2) );
  }

  getUserById(userId : number):Observable<any>{
    const url = environment.domain_url + `/api/usuarios/obtenerUsuario?USU_ID=${userId}`;
    return this.http.get<any>(url).pipe(retry(2));
  }

  
  editarCategoria(cat:Categoria){
    const url = environment.domain_url + '/api/categoria/actualizar';
    const datos = {
      CAT_ID : cat.CAT_ID,
      CAT_NUEVO_NOMBRE : cat.CAT_NOMBRE
    }    
    return this.http.put<any>(url,datos).pipe( retry(2));
  }
}
