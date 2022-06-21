import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Cliente } from '../models/clientes.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http:HttpClient, private storage: StorageService) { }
  listarCliente(): Observable<any>{
    const url= environment.domain_url+'/api/cliente/listarClientes.php';
    return this.http.get<any>(url).pipe(retry(2));
}
registerCliente(clientes:Cliente):Observable<any>{
  const url = environment.domain_url + '/api/cliente/registrarCliente.php';
  const datos = { 
    CLIENTE_NOMBRES : clientes.CLIENTE_NOMBRES,
    CLIENTE_APELLIDOS:clientes.CLIENTE_APELLIDOS,
    CLIENTE_DNI:clientes.CLIENTE_DNI,
    CLIENTE_CORREO: clientes.CLIENTE_CORREO,
    CLIENTE_TELEFONO: clientes.CLIENTE_TELEFONO,
    CLIENTE_ESTADO : 1, //Habilitado(1) / Deshabilitado(0) / Cambio de contraseña (2) 
    
  }
  return this.http.post<any>(url,datos).pipe(retry(1));
}
}
