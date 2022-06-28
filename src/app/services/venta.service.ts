import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DetalleVenta } from '../models/detalleVenta.model';
import { Venta } from '../models/venta.model';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root'
})
export class VentaService {

  constructor(private http:HttpClient, private storage: StorageService) { }

  listarVentas(): Observable<any>{
    const url= environment.domain_url+ '/api/venta/listarVentas.php';
    return this.http.get<any>(url).pipe(retry(2));
  }

  listarDetalleVentas(ventaId:number): Observable<any>{
    const url= environment.domain_url+  `/api/detalleventa/listarDetallesVenta.php?VENTA_ID=${ventaId} `;
    return this.http.get<any>(url).pipe(retry(2));
  }

  registrarVenta(venta:Venta,detalle:DetalleVenta[]):Observable<any>{
    console.log("registrar Venta")
    const url = environment.domain_url + '/api/venta/registrarVenta.php';
    // const fechaActual = this.datePipe.transform(new Date().toLocaleString("en-US", {timeZone: "America/Lima"}), "yyyy-MM-dd");
    const ventaNueva={
      USU_ID:1, 
      CLIENTE_ID:venta.CLIENTE_ID, 
      COMPROBANTE_ID:venta.COMPROBANTE_ID,
      METODO_PAGO_ID:venta.METODO_PAGO_ID,
      VENTA_SUBTOTAL:venta.VENTA_SUBTOTAL,
      VENTA_TOTAL:venta.VENTA_TOTAL
    }
    const datos = {
      VENTA:ventaNueva,  
      DETALLE_DE_VENTA:detalle
    }
    return this.http.post<any>(url,datos).pipe(retry(1));
  }
  
  listarMetodoPago(): Observable<any>{
    const url= environment.domain_url+ '/api/pago/listarMetodos.php';
    return this.http.get<any>(url).pipe(retry(2));
  }
  

}
