import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProveedorByName'
})
export class FilterProveedorByNamePipe implements PipeTransform {

  transform(value: any, arg: string): any[] {
    let resultadoTexto = [];
    for(let proveedor of value){
      if(proveedor.PROV_NOMBRE.toLowerCase().indexOf(arg.toLowerCase()) > -1 ){
        resultadoTexto.push(proveedor);
      };
    };
    return resultadoTexto;
  }
}
