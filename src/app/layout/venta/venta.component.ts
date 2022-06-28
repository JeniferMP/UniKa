import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from 'src/app/models/clientes.model';
import { DetallePrenda } from 'src/app/models/detallePrenda.model';
import { DetalleVenta } from 'src/app/models/detalleVenta.model';
import { MetodoPago } from 'src/app/models/metodoPago.model';
import { Prenda } from 'src/app/models/prenda.model';
import { Venta } from 'src/app/models/venta.model';
import { ClientesService } from 'src/app/services/clientes.service';
import { CompraService } from 'src/app/services/compra.service';
import { PrendaService } from 'src/app/services/prenda.service';
import { VentaService } from 'src/app/services/venta.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  VENTA_ID:any;
  ventas_iniciales: any[]=[];
  ventas: Venta[]=[];
  prendas_iniciales: any[]=[];
  prendasDetalles_iniciales: any[]=[];
  prendasDetalles: DetallePrenda[]=[];
  clientes_iniciales: any[]=[];
  clientes: Cliente[]=[];
  ventaSeleccionada= new Venta();
  ventaDetalleCreadas: DetalleVenta []=[];
  ventaDetalleCreada= new DetalleVenta();
  prendaDetalle= new DetallePrenda();
  ventaDetallesObtenidos: any[]=[];
  ventaDetalles: DetalleVenta[]=[];
  existsVentaDetalleCreadas=true;
  ventaNueva= new Venta();
  metodosPago_iniciales: any[]=[]
  metodosPago: MetodoPago[]=[]
  prenda= new Prenda()
  totalDetalleValor: number
  totalVentaValor: number
  ventaForm : FormGroup = this.formBuilder.group({
    // numComprobante:['',Validators.pattern('[A-Za-z0-9-]+')],
    tipoComprobante:[''],
    cliente:['', Validators.required],
    metodoPago:['', Validators.required],
    totalVenta:['']
    // proveedor:['',[Validators.required]]
  });
  ventaDetalleForm : FormGroup = this.formBuilder.group({
    prendaDetalleId:['',[Validators.required]],
    precio: ['',[Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
    cantidad: ['',[Validators.required, Validators.pattern('[0-9]*')]],
    totalDetalle:['']
  });
  constructor(
    private formBuilder: FormBuilder,
    private ventaService: VentaService,
    private clienteService: ClientesService,
    private compraService: CompraService,
    private prendaService: PrendaService,
    public modal: NgbModal,
    public configModal: NgbModalConfig
  ) {
    configModal.backdrop = 'static';
    configModal.keyboard = false;
    configModal.size='lg'

   }
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;
  currentPage = 1;
  itemsPerPage = 50;

  @ViewChild('seeDetalle') seeDetalle: ElementRef; 
  @ViewChild('agregarVentaModal') agregarVentaModal: ElementRef; 
  @ViewChild('agregarDetalleModal') agregarDetalleModal: ElementRef;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.listarVentas();
  }

  get cliente() {
    return this.ventaForm.get('cliente');
  }
  get tipoComprobante() {
    return this.ventaForm.get('tipoComprobante');
  }
  get metodoPago() {
    return this.ventaForm.get('metodoPago');
  }
  get totalVenta() {
    return this.ventaForm.get('totalVenta');
  }
  get prendaDetalleId() {
    return this.ventaDetalleForm.get('prendaDetalleId');
  }
  get precio() {
    return this.ventaDetalleForm.get('precio');
  }
  get cantidad() {
    return this.ventaDetalleForm.get('cantidad');
  }
  get totalDetalle() {
    return this.ventaDetalleForm.get('totalDetalle');
  }

  inicializarFormulario(){
    this.ventaForm.reset();
    }
  inicializarFormularioDetalle(){
    this.ventaDetalleForm.reset();
  }


    listarVentas(){
      this.cargando=true;
      this.mostrar_alerta=false;
      this.ventaService.listarVentas().subscribe(
        data=>{
          this.ventas_iniciales = data.resultado;
          this.ventas = this.ventas_iniciales.slice();
          this.cargando = false;
          console.log(this.ventas)
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
    seeMore(venta:Venta){
      this.ventaSeleccionada = venta;
      this.mostrar_alerta = false;
      this.listarDetalleVentas(venta.VENTA_ID);
      this.modal.open(this.seeDetalle);
    }
    closeModal(): any {
      this.modal.dismissAll();
      // this.comprasDetalle=[];
    }

    agregarVenta(){
      this.mostrar_alerta = false;
      this.inicializarFormulario();
      this.listarClientes();
      this.listarMetodosPago();
      this.ventaDetalleCreadas=[];
      this.modal.open(this.agregarVentaModal);
    }
    listarClientes(){
      this.cargando=true;
      this.mostrar_alerta=false;
      this.clienteService.listarCliente().subscribe(
        data=>{
          this.clientes_iniciales = data.resultado;
          this.clientes = this.clientes_iniciales.slice();
          this.cargando = false;
          console.log(this.ventas)
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
    registrarVenta(){
      console.log("Registrar Venta")
      this.cargando = true;
      if(this.ventaForm.invalid){
        console.log("Datos Invalidos")
        this.modalIn = true;
        this.mostrar_alerta = true;
        this.cargando = false;
        this.tipo_alerta = 'danger';
        this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
      }else{
        console.log("Datos validos")
        this.modalIn = true;
        this.ventaNueva.CLIENTE_ID=this.cliente!.value;
        this.ventaNueva.COMPROBANTE_ID=this.tipoComprobante!.value;
        this.ventaNueva.METODO_PAGO_ID=this.metodoPago!.value;
        this.ventaNueva.VENTA_TOTAL=this.totalVentaValor;
        this.ventaNueva.VENTA_SUBTOTAL=this.totalVentaValor;
        console.log(this.ventaNueva)
        this.ventaService.registrarVenta(this.ventaNueva,this.ventaDetalleCreadas).subscribe(
          data=>{
            if(data.exito){
              this.modalIn = false;
              this.closeModal();
              this.mensaje_alerta = 'Venta registrada con éxito.';
              this.tipo_alerta = 'success';
              this.mostrar_alerta = true;
              this.listarVentas();
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
              } else if (error.error.error === 'error_NoExistenciaUsuarioId'){
                this.mensaje_alerta = 'El id del usuario ingresado no existe.';
              }
              else if (error.error.error === 'error_ejecucionQuery'){
                this.mensaje_alerta = 'Hubo un error al ingresar la venta.';
              }
              else if (error.error.error === 'error_NoExistenciaComprobanteId'){
                this.mensaje_alerta = 'El id del comprobante ingresado no existe.';
              }
              else if (error.error.error === 'error_NoExistenciaMétodoDePagoId'){
                this.mensaje_alerta = 'El id del método de pago ingresado no existe.';
              }
              else if (error.error.error === 'error_NoExistenciaClienteId'){
                this.mensaje_alerta = 'El id del cliente ingresado no existe.';
              }
            }
            else{
              this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página o inténtelo más tarde.';
            }
          }
        )
      }
    }

  agregarDetalleVenta(){
    console.log(this.existsVentaDetalleCreadas)
    this.mostrar_alerta = false;
    this.inicializarFormularioDetalle();
    this.listarDetallePrendas();
    this.modal.open(this.agregarDetalleModal);
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
    this.ventaDetalleCreada=new DetalleVenta(); 
    this.ventaDetalleCreada.DET_PREN_ID=this.prendaDetalleId!.value;
    console.log(this.prendaDetalleId!.value)
    this.ventaDetalleCreada.DET_VENTA_CANTIDAD=this.cantidad!.value;
    console.log(this.ventaDetalleCreada.DET_VENTA_CANTIDAD)
    this.ventaDetalleCreada.DET_VENTA_UNITARIO=this.precio!.value;
    this.prendaDetalle=this.prendasDetalles.filter(prenda => prenda.DET_PREN_ID == this.prendaDetalleId!.value)[0];
    this.ventaDetalleCreada.PREN_CODIGO=this.prendaDetalle.PREN_CODIGO
    this.ventaDetalleCreada.PREN_NOMBRE=this.prendaDetalle.PREN_NOMBRE
    this.ventaDetalleCreada.PREN_MARCA=this.prendaDetalle.PREN_MARCA
    this.ventaDetalleCreada.DET_VENTA_TOTAL=this.totalDetalleValor
    this.ventaDetalleCreada.TALLA_NOMBRE=this.prendaDetalle.TALLA_NOMBRE
    this.ventaDetalleCreadas.push(this.ventaDetalleCreada);
    console.log(this.ventaDetalleCreadas)
    this.existsVentaDetalleCreadas=this.ventaDetalleCreadas.length>0?false:true;
  }

  listarDetalleVentas(ventaId:number){
    this.cargando=true;
    this.mostrar_alerta=false;
    this.ventaService.listarDetalleVentas(ventaId).subscribe(
      data=>{
        this.ventaDetallesObtenidos = data.resultado;
        this.ventaDetalles = this.ventaDetallesObtenidos.slice();
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
  listarMetodosPago(){
    this.cargando=true;
    this.mostrar_alerta=false;
    this.ventaService.listarMetodoPago().subscribe(
      data=>{
        this.metodosPago_iniciales = data.resultado;
        this.metodosPago = this.metodosPago_iniciales.slice();
        this.cargando = false;
        console.log(this.ventas)
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

  obtenerPrenda(prendaId:number){
    console.log("Obteniendo Prenda")
    this.cargando=true;
    this.mostrar_alerta=false;
    this.prendaService.obtenerPrendaporId(prendaId).subscribe(
      data=>{
        this.prendas_iniciales = data.resultado;
        this.prenda = this.prendas_iniciales.slice()[0];
        this.cargando = false;
        console.log(this.ventas)
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
  calcularTotalDetalle(){
    this.totalDetalleValor=this.cantidad!.value * this.precio!.value;
    console.log(this.totalDetalle)
  }
  calcularTotalVenta(){
   this.totalVentaValor= this.ventaDetalleCreadas.map(item => item.DET_VENTA_TOTAL).reduce((prev, curr) => prev + curr, 0);
  }
}
