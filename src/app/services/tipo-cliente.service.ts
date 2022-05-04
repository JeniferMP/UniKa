import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoClienteService {

  constructor(private http: HttpClient) { }

  listarTiposClientes():Observable<any>{
    const url = environment.domain_url + '/api/TipoCliente/listar';
    return this.http.get<any>(url).pipe(retry(2));
  }
}
