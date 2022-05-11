import { Component, OnInit } from '@angular/core';
import { PrendaService } from 'src/app/services/prenda.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-prenda',
  templateUrl: './prenda.component.html',
  styleUrls: ['./prenda.component.css']
})
export class PrendaComponent implements OnInit {

  constructor(
    private prendaService:PrendaService,
    private categoriaService:CategoriaService,
    private formBuilder: FormBuilder,
    public modal: NgbModal,
    configModal: NgbModalConfig)
    { 
      configModal.backdrop = 'static';
      configModal.keyboard = false;
    }

    prendas:any[]=[];
    prendas_iniciales: any[] = [];
    categorias_iniciales: any[]=[];
    categorias: any[]=[];
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta :string;
  ngOnInit(): void {
    this.listarProductos(2)

  }

  listarProductos(id_cat:number){
    this.cargando = true;
    this.modalIn = false;
    this.prendaService.listarPrendasHabilitadasPorCategoria(id_cat).subscribe(
      (data)=>{
        this.prendas_iniciales = data['resultado'];
        this.prendas = this.prendas_iniciales.slice();
        this.cargando = false;
      },
      (error) =>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        this.modalIn = false;
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      }
    ); 
  }

  listarCategorias(){
    
    this.modalIn = false;
    this.mostrar_alerta = false; 
    this.categoriaService.listarCategoria().subscribe(data=>{
      
      this.categorias_iniciales = data['resultado']; 
      this.categorias = this.categorias_iniciales.slice();
      console.log(this.categorias);
      this.cargando = false;
    },error =>{
      this.cargando = false;
      this.mostrar_alerta = true;
      this.tipo_alerta='danger';
      if (error['error']['error'] !== undefined) {
        if (error['error']['error'] === 'error_deBD') {
          this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
        }
      }
      else{
        this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
      }
    }
    );
  }

}
