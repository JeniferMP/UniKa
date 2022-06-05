import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CompraService } from 'src/app/services/compra.service';
import { StorageService } from 'src/app/services/storage.service';
import { Compra } from 'src/app/models/compra.model';
import { DetalleCompra } from 'src/app/models/detalleCompra.model';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {

  COMPRA_ID: any;
  comprasObtenidas: any[]=[];
  compras: Compra []=[];
  comprasDetalleObtenidas: any[]=[];
  comprasDetalle: DetalleCompra []=[];

  compraForm : FormGroup = this.formBuilder.group({
    numComprobante:['',[Validators.required, Validators.maxLength(60)]],
    // email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/), Validators.maxLength(60)]],
    // contrasena: ['', [Validators.minLength(8), Validators.maxLength(20)]],
    // nombres: ['', [Validators.required, Validators.pattern('[a-zñáéíóú A-ZÑÁÉÍÓÚ ]+'), Validators.maxLength(50)]],
    // apellido_paterno: ['', [Validators.required, Validators.pattern('^[a-zñáéíóúA-ZÑÁÉÍÓÚ ]+$'), Validators.maxLength(30)]],
    // apellido_materno: ['', [Validators.required, Validators.pattern('^[a-zñáéíóúA-ZÑÁÉÍÓÚ ]+$'), Validators.maxLength(30)]],
    // fecha_nacimiento: ['', [Validators.required ]],
    // celular: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(9), Validators.minLength(9)]] ,
    // dni: ['', [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(8),  Validators.maxLength(8)]],
    // direccion: ['', [Validators.required , Validators.pattern('^[a-zñáéíóú#°/,. A-ZÑÁÉÍÓÚ  0-9]+$'), Validators.maxLength(100)]],
    // rol:['',[Validators.required]],
    // sexo:['']
  });


  constructor(
    private formBuilder: FormBuilder,
    public modal: NgbModal,
    public configModal: NgbModalConfig,
    private compraService: CompraService,
    private storageService: StorageService
  ) { 
    configModal.backdrop = 'static';
    configModal.keyboard = false;
    configModal.size='lg'
  }
  filtroTexto:string = '';
  compraSeleccionada = new Compra(); 
  newCompra = new Compra();
  currentPage = 1;
  itemsPerPage = 50;

  //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;

  @ViewChild('seeDetalle') seeDetalle: ElementRef; 

  @ViewChild('agregarCompraModal') agregarCompraModal: ElementRef;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.listarCompras();
    this.COMPRA_ID = this.storageService.getString('COMPRA_ID ');
  }

  inicializarFormulario(){
    this.compraForm.reset();
    }
  listarCompras(){
    this.cargando=true;
    this.mostrar_alerta=false;
    this.compraService.listarCompras().subscribe(
      data=>{
        this.comprasObtenidas = data.resultado;
        this.compras = this.comprasObtenidas.slice();
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

  listarDetalleCompras(compraId:number){
    this.cargando=true;
    this.mostrar_alerta=false;
    this.compraService.listarDetalleCompras(compraId).subscribe(
      data=>{
        this.comprasDetalleObtenidas = data.resultado;
        this.comprasDetalle = this.comprasDetalleObtenidas.slice();
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
  seeMore(compra:Compra){
    this.compraSeleccionada = compra;
    this.mostrar_alerta = false;
    this.modal.open(this.seeDetalle);
    this.listarDetalleCompras(compra.COMPRA_ID);
  }

  closeModal(): any {
    this.modal.dismissAll();
  }

  agregarCompra(){
    this.mostrar_alerta = false;
    this.inicializarFormulario();
    this.modal.open(this.agregarCompraModal);
  }
}
