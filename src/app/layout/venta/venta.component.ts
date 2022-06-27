import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from 'src/app/models/clientes.model';
import { DetallePrenda } from 'src/app/models/detallePrenda.model';
import { DetalleVenta } from 'src/app/models/detalleVenta.model';
import { Venta } from 'src/app/models/venta.model';
import { ClientesService } from 'src/app/services/clientes.service';
import { CompraService } from 'src/app/services/compra.service';
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
  prendasDetalles_iniciales: any[]=[];
  prendasDetalles: DetallePrenda[]=[];
  clientes_iniciales: any[]=[];
  clientes: Cliente[]=[];
  ventaSeleccionada= new Venta();
  ventasDetalle: Venta[]=[];
  ventaDetalleCreadas: DetalleVenta []=[];
  ventaDetalleCreada= new DetalleVenta();
  prendaDetalle= new DetallePrenda();
  existsVentaDetalleCreadas=true;

  ventaForm : FormGroup = this.formBuilder.group({
    // numComprobante:['',Validators.pattern('[A-Za-z0-9-]+')],
    tipoComprobante:[''],
    cliente:['', Validators.required],
    // proveedor:['',[Validators.required]]
  });
  ventaDetalleForm : FormGroup = this.formBuilder.group({
    prendaDetalleId:['',[Validators.required]],
    precio: ['',[Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
    cantidad: ['',[Validators.required, Validators.pattern('[0-9]*')]],
  });
  constructor(
    private formBuilder: FormBuilder,
    private ventaService: VentaService,
    private clienteService: ClientesService,
    private compraService: CompraService,
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
  get prendaDetalleId() {
    return this.ventaDetalleForm.get('prendaDetalleId');
  }
  get precio() {
    return this.ventaDetalleForm.get('precio');
  }
  get cantidad() {
    return this.ventaDetalleForm.get('cantidad');
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
      this.modal.open(this.seeDetalle);
      // this.listarDetalleCompras(venta.COMPRA_ID);
    }
    closeModal(): any {
      this.modal.dismissAll();
      // this.comprasDetalle=[];
    }

    agregarVenta(){
      this.mostrar_alerta = false;
      this.inicializarFormulario();
      this.listarClientes()
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
   console.log("RegistrarVenta")
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
    this.ventaDetalleCreada.DET_PRENDA_ID=this.prendaDetalleId!.value;
    console.log(this.prendaDetalleId!.value)
    this.ventaDetalleCreada.DET_VENTA_CANTIDAD=this.cantidad!.value;
    console.log(this.ventaDetalleCreada.DET_VENTA_CANTIDAD)
    this.ventaDetalleCreada.DET_VENTA_UNITARIO=this.precio!.value;
    this.prendaDetalle=this.prendasDetalles.filter(prenda => prenda.DET_PREN_ID == this.prendaDetalleId!.value)[0];
    this.ventaDetalleCreada.PREN_CODIGO=this.prendaDetalle.PREN_CODIGO
    this.ventaDetalleCreada.PREN_NOMBRE=this.prendaDetalle.PREN_NOMBRE
    this.ventaDetalleCreada.PREN_MARCA=this.prendaDetalle.PREN_NOMBRE
    this.ventaDetalleCreada.TALLA_NOMBRE=this.prendaDetalle.TALLA_NOMBRE
    this.ventaDetalleCreadas.push(this.ventaDetalleCreada);
    console.log(this.ventaDetalleCreadas)
    this.existsVentaDetalleCreadas=this.ventaDetalleCreadas.length>0?false:true;
  }

}
