import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Proveedor} from '../models/proveedor.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

constructor(private http:HttpClient, private storage: StorageService) { }

listarProveedor(): Observable<any>{
    const url= environment.domain_url+ '/api/proveedor/listarProveedor.php';
    return this.http.get<any>(url).pipe(retry(2));
}

registerProveedor(proveedor:Proveedor):Observable<any>{
  const url = environment.domain_url + '/api/proveedor/registrarProveedor.php';
  const datos = {
    
    PROV_NOMBRE : proveedor.PROV_NOMBRE,
    PROV_APELLIDOS : proveedor.PROV_APELLIDOS,
    PROV_RAZON_SOCIAL : proveedor.PROV_RAZON_SOCIAL,
    PROV_NUM_CONTACT: proveedor.PROV_NUM_CONTACT,
    PROV_DIRECCION : proveedor.PROV_DIRECCION,
    PROV_ESTADO : 1, //Habilitado(1) / Deshabilitado(0) / Cambio de contraseña (2) 
    
  }
  return this.http.post<any>(url,datos).pipe(retry(1));
}

}
