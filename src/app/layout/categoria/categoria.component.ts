import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Categoria } from 'src/app/models/categoria.model';
import { TipoCliente } from 'src/app/models/tipo-cliente.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { TipoClienteService } from 'src/app/services/tipo-cliente.service';
import { compare, SorteableDirective } from 'src/app/shared/directives/sorteable.directive';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  tipoClientes: TipoCliente[]=[];
  categorias: Categoria[] = [];
  categorias_iniciales: any;
   constructor(private categoriaService:CategoriaService,
                private tipoClienteService: TipoClienteService,
                private formBuilder: FormBuilder,
                public modal: NgbModal,
                configModal: NgbModalConfig) 
                { 
                  configModal.backdrop = 'static';
                  configModal.keyboard = false;
                  configModal.size = 'md'
                }

  //vARIABLE DE CARGA Y ERROR
  carga = false; 
  modalIn = false; 
  cargaModal = false; 
  categoriaForm: FormGroup;
  tipoAlerta = "";
  mostrarAlerta = false;
  mensajeAlerta= "";  

  filtroTexto:string;
  categoriaSeleccionada:Categoria; 
  currentPage = 1;
  itemsPerPage = 5;

  categoriaInsertar = new Categoria;

   //modal para editar una categoria
   @ViewChild('editarCategoria') editarCat: ElementRef;
   //modal para crear una categoria
   @ViewChild('crearCategoria') crearCat: ElementRef;

  ngOnInit(): void {
    
    this.carga = true;
    this.listarCategorias();
    this.listarTiposCliente();
    this.filtroTexto = '';
  }

  inicializarFormulario(){
    this.categoriaForm = this.formBuilder.group({
      nombreCategoria:['',[Validators.required, Validators.maxLength(60)]],
      tipoCliente : ['',[Validators.required]],
    });
  }

  get tipoCliente(){
    return this.categoriaForm.get('tipoCliente');
  }

  get nombreCategoria() {
    return this.categoriaForm.get('nombreCategoria');
  }

  listarTiposCliente(){
    this.carga = false;
    this.modalIn = true;
    this.tipoClienteService.listarTiposClientes().subscribe(
      (data)=>{
        this.tipoClientes = data['resultado'];
        this.carga = false;
        this.modalIn = true;
      },
      (error) =>{
        this.carga = false;
        this.mostrarAlerta = true;
        this.tipoAlerta='danger';
        this.modalIn = true;
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_deBD') {
            this.mensajeAlerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }
        }
        else{
          this.mensajeAlerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      }
    );
  }

  insertarCategoria(cat:any){
    this.carga = true;
    this.modalIn = true;
    this.mostrarAlerta = false;
    this.categoriaInsertar.CAT_NOMBRE = cat.nombreCategoria; 
    this.categoriaInsertar.IDTIPO_CLIENTE =  cat.tipoCliente;
    console.log(this.nombreCategoria);
    this.crearNuevaCategoria();
  }

  crearNuevaCategoria(){
    this.cargaModal = true;
    this.modalIn = true;
    this.mostrarAlerta = false; 
    this.categoriaService.crearCategoria(this.categoriaInsertar.CAT_NOMBRE).subscribe(data => {
      
      this.categoriaForm.reset();
      this.cargaModal = false;
      this.modal.dismissAll();  
      this.listarCategorias();
      this.tipoAlerta = 'success';
      this.mostrarAlerta = true; 
      this.mensajeAlerta = 'Se ha creado la categoría satisfactoriamente.';
    },error=>{
      this.cargaModal = false; 
      this.mostrarAlerta = true;
      this.tipoAlerta='danger';
      if (error['error']['error'] !== undefined) {
        if (error['error']['error'] === 'error_deBD') {
          this.mensajeAlerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
        }else if(error.error.error === 'error_deCampo'){
          this.mensajeAlerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
        }else if (error['error']['error'] === 'error_exitenciaNombre') {
          this.mensajeAlerta = 'El nombre ingresado ya existe.';
        }
      }
      else{
        this.mensajeAlerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
      }
    }
    );

  }

  
  listarCategorias(){
    
    this.modalIn = false;
    this.mostrarAlerta = false; 
    this.categoriaService.listarCategoria().subscribe(data=>{
      
      this.categorias_iniciales = data['resultado']; 
      this.categorias = this.categorias_iniciales.slice();
      console.log(this.categorias);
      this.carga = false;
    },error =>{
      this.carga = false;
      this.mostrarAlerta = true;
      this.tipoAlerta='danger';
      if (error['error']['error'] !== undefined) {
        if (error['error']['error'] === 'error_deBD') {
          this.mensajeAlerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
        }
      }
      else{
        this.mensajeAlerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
      }
    }
    );
  }

  closeModal(): any {
    this.mostrarAlerta = false; 
    this.categoriaForm.reset();
    this.modal.dismissAll();
  }
  
  abrirEditarCategoria(categoria:Categoria) {
    this.inicializarFormulario();
    this.mostrarAlerta = false; 
    this.categoriaSeleccionada = categoria;
    this.modal.open(this.editarCat);
  }

  abrirCrearCategoria() {
    this.mostrarAlerta = false; 
    this.inicializarFormulario();
    this.modal.open(this.crearCat);
  }

  filtrarCategoria(){
    this.currentPage = 1;
    this.categorias = this.categorias_iniciales.slice(); 
    if(this.filtroTexto == ''){
      this.categorias = this.categorias = this.categorias_iniciales.slice();   
    }else{
      this.categorias = this.categorias = this.categorias_iniciales.slice(); 
      this.categorias = this.categorias.filter(categoria =>categoria.CAT_NOMBRE.toLowerCase().indexOf(this.filtroTexto.toLowerCase()) > -1);
    }
  }


  /*****************Tablas**********/
  @ViewChildren(SorteableDirective) headers: QueryList<SorteableDirective>;

  onSort({column, direction}: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // sorting countries
    if (direction === '' || column === '') {
      this.categorias = this.categorias_iniciales.slice();
    } else {
      this.categorias = [...this.categorias_iniciales].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

}
