import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../services/storage.service'; 
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient, private storageService: StorageService) { }
    login(usuario:string, contrasenia:string) : Observable<any>{
        const url=environment.domain_url + '/api/Usuarios/login.php';
        const body= { 
            "USU_IDENTIFICADOR" : usuario,
            "USU_CONTRASENIA" : contrasenia
        }
        return this.http.post<any>( url, body);
    }
}
