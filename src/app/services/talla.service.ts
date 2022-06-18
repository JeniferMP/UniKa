import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { retry } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TallaService {

  constructor(private http: HttpClient) { }


  listarTallas():Observable<any>{
    const url = environment.domain_url + '/api/talla/listarTallas.php';
    return this.http.get<any>(url).pipe( retry(2) );
  }

  
}
