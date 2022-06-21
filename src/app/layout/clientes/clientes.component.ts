import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler/src/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from 'src/app/models/clientes.model';
import { ClientesService } from 'src/app/services/clientes.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente []=[];
  clientesObtenidos: any[]=[];
  CLIENTES_ID: any;
  datePipe: any;
  IdCliente : number = 0;
  clienteForm : FormGroup = this.formBuilder.group({
    nombres: ['', [Validators.required, Validators.pattern('[a-zñáéíóú A-ZÑÁÉÍÓÚ ]+'), Validators.maxLength(50)]],
    apellidos: ['', [Validators.required, Validators.pattern('^[a-zñáéíóúA-ZÑÁÉÍÓÚ ]+$'), Validators.maxLength(30)]],
    dni: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(8), Validators.minLength(8)]] ,
    telefono: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(9), Validators.minLength(9)]] ,
    email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/), Validators.maxLength(60)]],
  });

  constructor(private formBuilder: FormBuilder,
    public modal: NgbModal,
    public configModal: NgbModalConfig,
    private clientesService: ClientesService,
    private storageService:StorageService) {
      configModal.backdrop = 'static';
      configModal.keyboard = false;
      configModal.size = 'lg'
    }

    filtroTexto:string = '';
    clienteSelected = new Cliente(); 
    newCliente= new Cliente();
    currentPage = 1;
    itemsPerPage = 50;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.listarClientes();
    this.CLIENTES_ID = this.storageService.getString('CLIENTES_ID');
  }
  inicializarFormulario(){
    this.clienteForm.reset();
    }

  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;

  @ViewChild('editCliModal') editCliModal: ElementRef;
  //modal para crear un usuario
  @ViewChild('createCliModal') createCliModal: ElementRef;
  //modal para visualizar un usuario
  @ViewChild('seeMoreModal') seeMoreModal: ElementRef; 

  get nombres() {
    return this.clienteForm.get('nombres');
  }
  get apellidos() {
    return this.clienteForm.get('apellidos');
  }
  get dni() {
    return this.clienteForm.get('dni');
  }
  get telefono() {
    return this.clienteForm.get('telefono');
  }
  get email() {
    return this.clienteForm.get('email');
  }

  listarClientes(){
    this.cargando=true;
    this.mostrar_alerta=false;
    this.clientesService.listarCliente().subscribe(
      data=>{
        this.clientesObtenidos = data.resultado;
        this.clientes = this.clientesObtenidos.slice();
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

  registerClienteModal(){
    this.mostrar_alerta = false;
    this.inicializarFormulario();
    this.modal.open(this.createCliModal);
  }

  createCliente(){
    this.cargando = true;
    if(this.clienteForm.invalid){
      this.modalIn = true;
      this.mostrar_alerta = true;
      this.cargando = false;
      this.tipo_alerta = 'danger';
      this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
    }else{
      this.modalIn = true;
      this.newCliente.CLIENTE_NOMBRES = this.nombres!.value;
      this.newCliente.CLIENTE_APELLIDOS = this.apellidos!.value;
      this.newCliente.CLIENTE_DNI = this.dni!.value;
      this.newCliente.CLIENTE_TELEFONO = this.telefono!.value;
      this.newCliente.CLIENTE_CORREO = this.email!.value;
      this.newCliente.CLIENTE_ESTADO = 1; //Habilitado(1) / Deshabilitado(0) / Cambio de contraseña (2) 
      this.clientesService.registerCliente(this.newCliente).subscribe(
        data=>{
          if(data.exito){
            this.modalIn = false;
            this.closeModal();
            this.mensaje_alerta = 'Cliente registrado con éxito.';
            this.tipo_alerta = 'success';
            this.mostrar_alerta = true;
            this.listarClientes();
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
  closeModal(): any {
    this.modal.dismissAll();
  }

  

}
