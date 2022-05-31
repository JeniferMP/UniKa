import { Component,ElementRef, OnInit,ViewChild } from '@angular/core';
import { PrendaService } from 'src/app/services/prenda.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/services/storage.service';
import { Prenda } from 'src/app/models/prenda.model';

@Component({
  selector: 'app-prenda',
  templateUrl: './prenda.component.html',
  styleUrls: ['./prenda.component.css']
})
export class PrendaComponent implements OnInit {

  prendas:any[]=[];
  prendas_iniciales: any[] = [];
  categorias_iniciales: any[]=[];
  categorias: any[]=[];
  PREN_ID: any;
  nuevaPrenda = new Prenda();
  prendaSeleccionada = new Prenda();
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta :string;
  filtroTexto:string = '';
    currentPage = 1;
    itemsPerPage = 50;
  IdPrenda : number = 0;

  prendaForm : FormGroup = this.formBuilder.group({
    codigo: ['', [Validators.required , Validators.pattern('^[^$%&|<>#]*$'), Validators.maxLength(20)]],
    //[a-zñáéíóú A-ZÑÁÉÍÓÚ ]+  
    nombre: ['',[Validators.required, Validators.maxLength(60)]],
    marca: ['',[Validators.required, Validators.maxLength(20)]],
    precio: ['',[Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$') ,Validators.maxLength(60)]],
    categoria:['',[Validators.required]]
});


  constructor(
    private prendaService:PrendaService,
    private categoriaService:CategoriaService,
    private formBuilder: FormBuilder,
    public modal: NgbModal,
    private storageService:StorageService,
    configModal: NgbModalConfig)
    { 
      configModal.backdrop = 'static';
      configModal.keyboard = false;
    }

   
  @ViewChild('crearPrendaModal') crearPrendaModal: ElementRef;
  @ViewChild('verMasModal') verMasModal: ElementRef; 
  @ViewChild('editPrendaModal') editPrendaModal: ElementRef; 

  ngOnInit(): void {
    this.listarPrendas()
    this.listarCategorias()
    this.PREN_ID = this.storageService.getString('PREN_ID');
  }
  openCentrado(contenido: any) {
    this.modal.open(contenido, { centered: true });
  }

  inicializarFormulario(){
    this.prendaForm.reset();
    }

  get codigo() {
    return this.prendaForm.get('codigo');
  }
  get nombre() {
    return this.prendaForm.get('nombre');
  }
  get marca() {
    return this.prendaForm.get('marca');
  }
  get precio() {
    return this.prendaForm.get('precio');
  }
  get categoria() {
    return this.prendaForm.get('categoria');
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

  listarPrendas(){
    this.cargando = true;
    this.modalIn = false;
    this.prendaService.listarPrendas().subscribe(
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

  registerPrendaModal(){
    this.mostrar_alerta = false;
    this.inicializarFormulario();
    this.modal.open(this.crearPrendaModal);
  }

  closeModal(): any {
    this.modal.dismissAll();
  }
  crearPrenda(){
    this.cargando = true;
    if(this.prendaForm.invalid){
      this.modalIn = true;
      this.mostrar_alerta = true;
      this.cargando = false;
      this.tipo_alerta = 'danger';
      this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
    }else{
      this.modalIn = true;
      this.nuevaPrenda.PREN_CODIGO = this.codigo!.value;
      this.nuevaPrenda.PREN_NOMBRE = this.nombre!.value;
      this.nuevaPrenda.PREN_MARCA = this.marca!.value;
      this.nuevaPrenda.PREN_PRECIO = this.precio!.value;
      this.nuevaPrenda.PREN_ESTADO = 1;
      this.nuevaPrenda.PREN_IMAGEN = "";
      this.nuevaPrenda.CAT_ID = this.categoria!.value;
      
      

      this.prendaService.registerPrenda(this.nuevaPrenda).subscribe(
        data=>{
          if(data.exito){
            this.modalIn = false;
            this.closeModal();
            this.mensaje_alerta = 'Prenda registrada con éxito.';
            this.tipo_alerta = 'success';
            this.mostrar_alerta = true;
            this.listarPrendas();
          }
        },
        error=>{
          this.cargando = false;
          this.modalIn = true;
          this.mostrar_alerta = true;
          this.tipo_alerta='danger';
          if (error['error']['error'] !== undefined) {
            if (error['error']['error'] === 'error_deBD') {
              this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página o inténtelo más tarde.';
            }
            if (error['error']['error'] === 'error_ejecucionQuery') {
              this.mensaje_alerta = 'Hubo un error al registrar la prenda. Por favor, actualice la página o inténtelo más tarde.';
            }
            else if (error['error']['error'] === 'error_exitenciaCategoriaId') {
              this.mensaje_alerta = 'El id de la categoria no existe.';
            }
            else if (error['error']['error'] === 'error_existenciaPrendaCodigo') {
              this.mensaje_alerta ='La prenda con código '+this.nuevaPrenda.PREN_CODIGO+' ya está registrada.';
            }
            else if (error['error']['error'] === 'error_existenciaPrendaNombre') {
              this.mensaje_alerta ='La prenda '+this.nuevaPrenda.PREN_NOMBRE+' ya está registrada.';
            }
          }
          else{
            this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página o inténtelo más tarde.';
          }
        }
      )
    }
  }
  verMas(prenda:Prenda){
    this.prendaSeleccionada = prenda;
    this.mostrar_alerta = false;
    this.modal.open(this.verMasModal);
  }

  prenda_editar : Prenda = new Prenda();
  editPrenda(prenda:any){
    this.IdPrenda= prenda.PREN_ID;
    this.prenda_editar = prenda;
    console.log(this.prenda_editar);
    this.mostrar_alerta = false;
    this.codigo!.setValue(prenda.PREN_CODIGO);
    this.nombre!.setValue(prenda.PREN_NOMBRE);
    this.marca!.setValue(prenda.PREN_MARCA);
    this.precio!.setValue(prenda.PREN_PRECIO);
    this.categoria!.setValue(prenda.CAT_ID);
    this.modal.open(this.editPrendaModal);
  }

  actualizarPrenda(){
    this.mostrar_alerta = false;
    this.cargando = true;
    this.modalIn = true;
    this.prenda_editar.PREN_CODIGO = this.codigo!.value;
    this.prenda_editar.PREN_CODIGO = this.codigo!.value;
    this.prenda_editar.PREN_NOMBRE = this.nombre!.value;
    this.prenda_editar.PREN_MARCA = this.marca!.value;
    this.prenda_editar.PREN_PRECIO = this.precio!.value;
    this.prenda_editar.PREN_ESTADO = 1;
    this.prenda_editar.PREN_IMAGEN = "";
    this.prenda_editar.CAT_ID = this.categoria!.value;
    this.prendaService.actualizarPrenda(this.prenda_editar).subscribe(
      (data)=>{
        this.cargando = false;
        this.modalIn = false;
        this.closeModal();
        this.mensaje_alerta = 'Prenda actualizada con éxito.';
        this.tipo_alerta = 'success';
        this.mostrar_alerta = true;
        this.listarPrendas();
        console.log(data);
      },
      (error)=>{
        this.cargando = false;
        this.modalIn = true;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_ejecucionQuery') {
            this.mensaje_alerta = 'Hubo un error al actualizar la prenda. Por favor, actualice la página o inténtelo más tarde.';
          }
          else if(error['error']['error'] === 'error_exitenciaCategoriaId') {
            this.mensaje_alerta = 'La categoría no existe.';
          }
          else if(error['error']['error'] === 'error_exitenciaId') {
            this.mensaje_alerta = 'La prenda no existe';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página o inténtelo más tarde.';
        }
      }
    )
  }

}
