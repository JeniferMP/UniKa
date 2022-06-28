import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CompraService } from 'src/app/services/compra.service';
import { StorageService } from 'src/app/services/storage.service';
import { Compra } from 'src/app/models/compra.model';
import { DetalleCompra } from 'src/app/models/detalleCompra.model';
import { Proveedor } from 'src/app/models/proveedor.model';
import { Prenda } from 'src/app/models/prenda.model';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { PrendaService } from 'src/app/services/prenda.service';
import { DetallePrenda } from 'src/app/models/detallePrenda.model';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {

  COMPRA_ID: any;
  comprasObtenidas: any[]=[];
  proveedoresObtenidos: any[]=[];
  compras: Compra []=[];
  proveedores: Proveedor []=[];
  comprasDetalleObtenidas: any[]=[];
  comprasDetalle: DetalleCompra []=[];
  prendas_iniciales: any[]=[];
  prendas: Prenda []=[];
  prendasDetalles_iniciales: any[]=[];
  prendasDetalles: DetallePrenda []=[];
  comprasDetalleCreadas: DetalleCompra []=[];
  compraDetalleCreada= new DetalleCompra();
  prendaObtenida= new Prenda();
  prendaDetalle= new DetallePrenda();
  compraNueva= new Compra();


  compraForm : FormGroup = this.formBuilder.group({
    numComprobante:['',Validators.pattern('[A-Za-z0-9-]+')],
    tipoComprobante:[''],
    proveedor:['',[Validators.required]]
  });

  compraDetalleForm : FormGroup = this.formBuilder.group({
    prendaDetalleId:['',[Validators.required]],
    precio: ['',[Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
    cantidad: ['',[Validators.required, Validators.pattern('[0-9]*')]],
  });


  constructor(
    private formBuilder: FormBuilder,
    public modal: NgbModal,
    public configModal: NgbModalConfig,
    private compraService: CompraService,
    private storageService: StorageService,
    private proveedorService: ProveedorService,
    private prendaService: PrendaService
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
  existsComprasDetalleCreadas=true;

  @ViewChild('seeDetalle') seeDetalle: ElementRef; 

  @ViewChild('agregarCompraModal') agregarCompraModal: ElementRef;

  @ViewChild('agregarDetalleModal') agregarDetalleModal: ElementRef;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.listarCompras();
    this.COMPRA_ID = this.storageService.getString('COMPRA_ID ');
  }

  inicializarFormulario(){
    this.compraForm.reset();
    }
    
  inicializarFormularioDetalle(){
      this.compraDetalleForm.reset();
    }

    get numComprobante() {
      return this.compraForm.get('numComprobante');
    }
    get tipoComprobante() {
      return this.compraForm.get('tipoComprobante');
    }
    get proveedor() {
      return this.compraForm.get('proveedor');
    }
    get prendaDetalleId() {
      return this.compraDetalleForm.get('prendaDetalleId');
    }
    get precio() {
      return this.compraDetalleForm.get('precio');
    }
    get cantidad() {
      return this.compraDetalleForm.get('cantidad');
    }
  listarCompras(){
    console.log(this.existsComprasDetalleCreadas)
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
    this.comprasDetalle=[];
  }

  agregarCompra(){
    this.existsComprasDetalleCreadas=true;
    console.log(this.existsComprasDetalleCreadas)
    this.mostrar_alerta = false;
    this.inicializarFormulario();
    this.listarProveedor();
    this.comprasDetalleCreadas=[];
    this.modal.open(this.agregarCompraModal);
  }

  agregarDetalleCompra(){
    console.log(this.existsComprasDetalleCreadas)
    this.mostrar_alerta = false;
    this.inicializarFormularioDetalle();
    this.listarDetallePrendas();
    this.modal.open(this.agregarDetalleModal);
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
  listarPrendas(){
    this.cargando = true;
    this.modalIn = false;
    this.prendaService.listarPrendas().subscribe(
      (data)=>{
        this.prendas_iniciales = data['resultado'];
        this.prendas = this.prendas_iniciales.slice();
        console.log(this.prendas)
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
  
  listarDetallePrendas(){
    this.cargando = true;
    this.modalIn = false;
    this.compraService.listarDetallePrendas().subscribe(
      (data)=>{
        this.prendasDetalles_iniciales = data['resultado'];
        this.prendasDetalles = this.prendasDetalles_iniciales.slice();
        console.log(this.prendasDetalles)
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
  agregarDetalle(){
    console.log("Agregar Detalle")
    this.modalIn=true
    this.compraDetalleCreada=new DetalleCompra(); 
    this.compraDetalleCreada.DET_PREN_ID=this.prendaDetalleId!.value;
    console.log(this.prendaDetalleId!.value)
    this.compraDetalleCreada.DET_COMPRA_CANTIDAD=this.cantidad!.value;
    console.log(this.compraDetalleCreada.DET_COMPRA_CANTIDAD)
    this.compraDetalleCreada.DET_COMPRA_PRECIO=this.precio!.value;
    this.prendaDetalle=this.prendasDetalles.filter(prenda => prenda.DET_PREN_ID == this.prendaDetalleId!.value)[0];
    this.compraDetalleCreada.PREN_CODIGO=this.prendaDetalle.PREN_CODIGO
    this.compraDetalleCreada.PREN_NOMBRE=this.prendaDetalle.PREN_NOMBRE
    this.compraDetalleCreada.PREN_MARCA=this.prendaDetalle.PREN_NOMBRE
    this.compraDetalleCreada.TALLA_NOMBRE=this.prendaDetalle.TALLA_NOMBRE
    this.comprasDetalleCreadas.push(this.compraDetalleCreada);
    console.log(this.comprasDetalleCreadas)
    this.existsComprasDetalleCreadas=this.comprasDetalleCreadas.length>0?false:true;
  }
  crearCompra(){
    console.log("Crear Compra")
    console.log(this.proveedor!.value)
    console.log(this.tipoComprobante!.value)
    console.log(this.numComprobante!.value)
    this.cargando = true;
    if(this.compraForm.invalid){
      console.log("Datos Invalidos")
      this.modalIn = true;
      this.mostrar_alerta = true;
      this.cargando = false;
      this.tipo_alerta = 'danger';
      this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
    }else{
      console.log("Datos validos")
      this.modalIn = true;
      this.compraNueva.PROV_ID=this.proveedor!.value;
      this.compraNueva.COMPROBANTE_ID=this.tipoComprobante!.value;
      this.compraNueva.COMPRA_NUM_COMPROBANTE=this.numComprobante!.value;
      console.log(this.compraNueva)
      this.compraService.registrarCompra(this.compraNueva,this.comprasDetalleCreadas).subscribe(
        data=>{
          if(data.exito){
            this.modalIn = false;
            this.closeModal();
            this.mensaje_alerta = 'Compra registrada con éxito.';
            this.tipo_alerta = 'success';
            this.mostrar_alerta = true;
            this.listarCompras();
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
            } else if (error.error.error === 'error_ExistenciaNumComprobanteCompra'){
              this.mensaje_alerta = 'El número del comprobante de la compra ya existe.';
            }
            else if (error.error.error === 'error_ejecucionQuery'){
              this.mensaje_alerta = 'No se logró obtener el id de la compra realizada.';
            }
            else if (error.error.error === 'error_ExistenciaDeComprobante'){
              this.mensaje_alerta = 'El id del comprobante ingresado no existe.';
            }
            else if (error.error.error === 'error_ExistenciaProveedorId'){
              this.mensaje_alerta = 'El id del proveedor ingresado no existe.';
            }
            else if (error.error.error === 'error_ExistenciaDeUsuario'){
              this.mensaje_alerta = 'El id del usuario ingresado no existe.';
            }
          }
          else{
            this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página o inténtelo más tarde.';
          }
        }
      )
    }
  }

  exportToExcel(): void {
    let element = document.getElementById('compras-table');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, "Compras.xlsx");
  }

}
