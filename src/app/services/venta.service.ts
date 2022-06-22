import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
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

  // listarDetalleCompras(compraId:number): Observable<any>{
  //   const url= environment.domain_url+  `/api/detallecompra/listarDetallesCompra.php?COMPRA_ID=${compraId} `;
  //   return this.http.get<any>(url).pipe(retry(2));
  // }

  // listarDetallePrendas(): Observable<any>{
  //   const url= environment.domain_url+  '/api/detallePrenda/listarDetalles.php';
  //   return this.http.get<any>(url).pipe(retry(2));
  // }

  // registrarCompra(compra:Compra,detalle:DetalleCompra[]):Observable<any>{
  //   console.log("registrar Compra")
  //   const url = environment.domain_url + '/api/compra/insertarCompra.php';
  //   // const fechaActual = this.datePipe.transform(new Date().toLocaleString("en-US", {timeZone: "America/Lima"}), "yyyy-MM-dd");
  //   const fechaActual = "2022-06-15"
  //   const compraNueva={
  //     USU_ID:1, 
  //     PROV_ID:compra.PROV_ID, 
  //     COMPROBANTE_ID:compra.COMPROBANTE_ID,
  //     COMPRA_NUM_COMPROBANTE:compra.COMPRA_NUM_COMPROBANTE,
  //     COMPRA_FECHA:fechaActual
  //   }
  //   const datos = {
  //     COMPRA:compraNueva,  
  //     DETALLES_DE_COMPRA:detalle
  //   }
  //   return this.http.post<any>(url,datos).pipe(retry(1));
  // }
  
  

}
