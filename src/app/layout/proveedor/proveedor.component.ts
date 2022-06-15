import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Proveedor } from 'src/app/models/proveedor.model';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { StorageService } from 'src/app/services/storage.service';
import { compare, SorteableDirective } from 'src/app/shared/directives/sorteable.directive';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {

  proveedores: Proveedor[];
  proveedoresObtenidos: any[]=[];
  //proveedorService: any;
  PROV_ID:any;
   //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;

  proveedorForm : FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.pattern('[a-zñáéíóú A-ZÑÁÉÍÓÚ ]+'), Validators.maxLength(50)]],
    apellidos: ['', [Validators.required, Validators.pattern('^[a-zñáéíóúA-ZÑÁÉÍÓÚ ]+$'), Validators.maxLength(30)]],
    razonSocial: ['', [Validators.required, Validators.pattern('^[a-zñáéíóúA-ZÑÁÉÍÓÚ ]+$'), Validators.maxLength(30)]],
    celular: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(9), Validators.minLength(9)]] ,
    direccion: ['', [Validators.required , Validators.pattern('^[a-zñáéíóú#°/,. A-ZÑÁÉÍÓÚ  0-9]+$'), Validators.maxLength(100)]],
  });

  constructor(private formBuilder: FormBuilder,
    public modal: NgbModal,
    public configModal: NgbModalConfig,
    private proveedorService: ProveedorService,
    private storageService:StorageService,) {
      configModal.backdrop = 'static';
      configModal.keyboard = false;
      configModal.size = 'lg'
    }
    filtroTexto:string = '';
    proveedorSelected = new Proveedor(); 
    newProveedor = new Proveedor();
    currentPage = 1;
    itemsPerPage = 50;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.listarProveedor();
    this.PROV_ID = this.storageService.getString('PROV_ID');
  }
  inicializarFormulario(){
    this.proveedorForm.reset();
    }
  



  @ViewChild('editProveedorModal') editProveedorModal: ElementRef;
  //modal para crear un usuario
  @ViewChild('createProveedorModal') createProveedorModal: ElementRef;
  //modal para visualizar un usuario
  @ViewChild('seeMoreModal') seeMoreModal: ElementRef; 

 get nombre() {
    return this.proveedorForm.get('nombre');
  }
  get apellidos() {
    return this.proveedorForm.get('apellidos');
  }
  get razonSocial() {
    return this.proveedorForm.get('razonSocial');
  }
  get celular() {
    return this.proveedorForm.get('celular');
  }
  get direccion() {
    return this.proveedorForm.get('direccion');
  }
  
  

  listarProveedor(){
    this.cargando=true;
    this.mostrar_alerta=false;
    this.proveedorService.listarProveedor().subscribe(
      data=>{
        this.proveedoresObtenidos = data.resultado;
        this.proveedores = this.proveedoresObtenidos.slice();
        this.cargando = false;
      },
      error=>{
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
    )
  }
  
  registerProveedorModal(){
    this.mostrar_alerta = false;
    this.inicializarFormulario();
    this.modal.open(this.createProveedorModal);
  }
  closeModal(): any {
    this.modal.dismissAll();
  }

  createProveedor(){
    this.cargando = true;
    if(this.proveedorForm.invalid){
      this.modalIn = true;
      this.mostrar_alerta = true;
      this.cargando = false;
      this.tipo_alerta = 'danger';
      this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
    }else{
      this.modalIn = true;
      this.newProveedor.PROV_NOMBRE = this.nombre!.value;
      this.newProveedor.PROV_APELLIDOS = this.apellidos!.value;
      this.newProveedor.PROV_RAZON_SOCIAL = this.razonSocial!.value;
      this.newProveedor.PROV_NUM_CONTACT = this.celular!.value;
      this.newProveedor.PROV_DIRECCION = this.direccion!.value;
      this.newProveedor.PROV_ESTADO = 1; //Habilitado(1) / Deshabilitado(0) / Cambio de contraseña (2) 
      this.proveedorService.registerProveedor(this.newProveedor).subscribe(
        data=>{
          if(data.exito){
            this.modalIn = false;
            this.closeModal();
            this.mensaje_alerta = 'Usuario registrado con éxito.';
            this.tipo_alerta = 'success';
            this.mostrar_alerta = true;
            this.listarProveedor();
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
            } else if (error.error.error === 'error_razonSocialExistente'){
              this.mensaje_alerta = 'La razon social ya le pertenece a un proveedor. Por favor, ingrese uno diferente.';
            } else if (error.error.error === 'error_CelularExistente'){
              this.mensaje_alerta = 'El numero de celular ya le pertenece a una proveedor, Por favor, ingrese uno diferente.';
            };
          }
          else{
            this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página o inténtelo más tarde.';
          }
        }
      )
    }
  }
  idProvedor: number=0;
  prove_editar : Proveedor = new Proveedor();
  editProveedor(provedor:any){
    this.idProvedor= provedor.PROV_ID;
    this.prove_editar=provedor;
    console.log(this.prove_editar);
    this.mostrar_alerta = false;
    this.nombre!.setValue(provedor.PROV_NOMBRE);
    this.apellidos!.setValue(provedor.PROV_APELLIDOS);
    this.razonSocial!.setValue(provedor.PROV_RAZON_SOCIAL);
    this.celular!.setValue(provedor.PROV_NUM_CONTACT);
    this.direccion!.setValue(provedor.PROV_DIRECCION);
    this.modal.open(this.editProveedorModal);
  }

  updateProveedor(){
    this.mostrar_alerta = false;
    this.cargando = true;
    this.modalIn = true;
    this.prove_editar.PROV_NOMBRE = this.nombre!.value;
    this.prove_editar.PROV_APELLIDOS = this.apellidos!.value;
    this.prove_editar.PROV_RAZON_SOCIAL = this.razonSocial!.value;
    this.prove_editar.PROV_NUM_CONTACT = this.celular!.value;
    this.prove_editar.PROV_DIRECCION = this.direccion!.value;
    this.proveedorService.updateProveedor(this.prove_editar).subscribe(
      (data)=>{
        this.cargando = false;
        this.modalIn = false;
        this.closeModal();
        this.mensaje_alerta = 'Usuario actualizado con éxito.';
        this.tipo_alerta = 'success';
        this.mostrar_alerta = true;
        this.listarProveedor();
        console.log(data);
      },
      (error)=>{
        this.cargando = false;
        this.modalIn = true;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página o inténtelo más tarde.';
          } else if (error.error.error === 'error_razonSocialExistente'){
            this.mensaje_alerta = 'La razon social ya le pertenece a un proveedor. Por favor, ingrese uno diferente.';
          } else if (error.error.error === 'error_CelularExistente'){
            this.mensaje_alerta = 'El numero de celular ya le pertenece a una proveedor, Por favor, ingrese uno diferente.';
          };
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página o inténtelo más tarde.';
        }
      }
    )
  }

  seeMore(proveedor:Proveedor){
    this.proveedorSelected = proveedor;
    this.mostrar_alerta = false;
    this.modal.open(this.seeMoreModal);
  }

  searchProveedores(){
    if(this.proveedores.length<0){
      this.mensaje_alerta = 'No existen usuarios registrados, registre uno y vuelva a intentarlo.';
      this.tipo_alerta = 'danger';
      this.mostrar_alerta = true;
      return;
    }else{
      //Realizar búsqueda de usuario
    }
  }

  habilitarInhabilitarProveedor(PROV_ID:number,PROV_ESTADO:number){
    this.cargando = true;
    
    this.modalIn = false;
    if(PROV_ESTADO == 0){
      PROV_ESTADO = +1; 
      this.mensaje_alerta = 'Se habilitó el usuario satisfactoriamente.';
    }else{
      PROV_ESTADO = +0; 
      this.mensaje_alerta = 'Se inhabilitó el usuario satisfactoriamente.'

    }
    
    this.proveedorService.habilitarInhabilitarProveedor(PROV_ID,PROV_ESTADO).subscribe(data=>
      { 
        this.tipo_alerta = 'success';
        this.mostrar_alerta = true; 
        this.listarProveedor();
      },error=>{
        this.cargando = false;
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        if (error['error']['error'] !== undefined) {
          if (error['error']['error'] === 'error_deBD') {
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, actualice la página.';
          }else if(error.error.error === 'error_deCampo'){
            this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
          }else if (error['error']['error'] === 'error_exitenciaId') {
            this.mensaje_alerta = 'El usuario seleccionado no existe.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página.';
        }
      });
  }


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
      this.proveedores = this.proveedoresObtenidos.slice();
    } else {
      this.proveedores = [...this.proveedoresObtenidos].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
