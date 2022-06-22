import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Venta } from 'src/app/models/venta.model';
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
  ventaSeleccionada= new Venta();
  ventasDetalle: Venta[]=[];
  ventaForm : FormGroup = this.formBuilder.group({
    // numComprobante:['',Validators.pattern('[A-Za-z0-9-]+')],
    // tipoComprobante:[''],
    // proveedor:['',[Validators.required]]
  });
  constructor(
    private formBuilder: FormBuilder,
    private ventaService: VentaService,
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

  ngOnInit(): void {
    this.inicializarFormulario();
    this.listarVentas();
  }

  inicializarFormulario(){
    this.ventaForm.reset();
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
      // this.listarProveedor();
      // this.comprasDetalleCreadas=[];
      this.modal.open(this.agregarVentaModal);
    }

}
