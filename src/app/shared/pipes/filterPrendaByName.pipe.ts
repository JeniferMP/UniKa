import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPrendaByName'
})
export class FilterPrendaByNamePipe implements PipeTransform {

  transform(value: any, arg: string): any[] {
    let resultadoTexto = [];
    for(let prenda of value){
      if(prenda.PREN_NOMBRE.toLowerCase().indexOf(arg.toLowerCase()) > -1 ){
        resultadoTexto.push(prenda);
      };
    };
    return resultadoTexto;
  }
}
