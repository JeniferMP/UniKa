import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { retry } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Prenda } from '../models/prenda.model';
import { DetallePrenda } from '../models/detallePrenda.model';

@Injectable({
  providedIn: 'root'
})
export class PrendaService {

  constructor(private http: HttpClient) { }


listarPrendasHabilitadasPorCategoria(idCat:number):Observable<any>{
    const url = environment.domain_url + '/api/prenda/listarPrendasHabilitadasPorCategoria.php?CAT_ID='+idCat;
    return this.http.get<any>(url).pipe( retry(2) );
  }

  listarPrendas():Observable<any>{
    const url = environment.domain_url + '/api/prenda/listarPrendas.php';
    return this.http.get<any>(url).pipe( retry(2) );
  }

  registerPrenda(prenda:Prenda):Observable<any>{
    const url = environment.domain_url + '/api/prenda/insertar.php';
    const datos = {
      
      PREN_CODIGO : prenda.PREN_CODIGO,
      PREN_NOMBRE : prenda.PREN_NOMBRE,
      PREN_MARCA :  prenda.PREN_MARCA,
      PREN_PRECIO : prenda.PREN_PRECIO,
      PREN_IMAGEN : prenda.PREN_IMAGEN,
      PREN_ESTADO : 1, //Habilitado(1) / Deshabilitado(0) / Cambio de contraseña (2) 
      CAT_ID :prenda.CAT_ID 
    }
    return this.http.post<any>(url,datos).pipe(retry(1));
  }
  actualizarPrenda(prenda:Prenda):Observable<any>{
    const url = environment.domain_url + '/api/prenda/actualizar.php';
    const datos = {
      PREN_ID : prenda.PREN_ID,
      PREN_CODIGO : prenda.PREN_CODIGO,
      PREN_NOMBRE : prenda.PREN_NOMBRE,
      PREN_MARCA :  prenda.PREN_MARCA,
      PREN_PRECIO : prenda.PREN_PRECIO,
      PREN_IMAGEN : prenda.PREN_IMAGEN,
      PREN_ESTADO : prenda.PREN_ESTADO, //Habilitado(1) / Deshabilitado(0) / Cambio de contraseña (2) 
      CAT_ID : prenda.CAT_ID,
    }
    return this.http.put<any>(url,datos).pipe(retry(2));
  }
  registrarDetallePrenda(detallePrenda:DetallePrenda):Observable<any>{
    const url = environment.domain_url + '/api/detallePrenda/insertarDetallePrenda.php';
    const datos = {
      
      PREN_ID : detallePrenda.PREN_ID,
      TALLA_ID : detallePrenda.TALLA_ID,
      DET_PREN_STOCK_MIN:detallePrenda.DET_PREN_STOCK_MIN
    }
    return this.http.post<any>(url,datos).pipe(retry(1));
  }
}
