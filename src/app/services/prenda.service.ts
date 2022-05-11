import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { retry } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrendaService {

  constructor(private http: HttpClient) { }


listarPrendasHabilitadasPorCategoria(idCat:number):Observable<any>{
    const url = environment.domain_url + '/api/prenda/listarPrendasHabilitadasPorCategoria.php?CAT_ID='+idCat;
    return this.http.get<any>(url).pipe( retry(2) );
  }
}
