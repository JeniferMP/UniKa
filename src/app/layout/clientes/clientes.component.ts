import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  CLI_ID: any;
  datePipe: any;
  IdCliente : number = 0;
  constructor(private formBuilder: FormBuilder,
    public modal: NgbModal,
    public configModal: NgbModalConfig,
    private clientesService: ClientesService,
    private storageService:StorageService) { }

    cliForm : FormGroup = this.formBuilder.group({})

  ngOnInit(): void {
    this.inicializarFormulario();
    
  }
  inicializarFormulario(){
    this.cliForm.reset();
    }
  
    filtroTexto:string = '';
    cliSelected = new Cliente(); 
    newCliente = new Cliente();
    currentPage = 1;
    itemsPerPage = 50;

  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;

  @ViewChild('editCliModal') editCliModal: ElementRef;
  //modal para crear un usuario
  @ViewChild('createUserModal') createCliModal: ElementRef;
  //modal para visualizar un usuario
  @ViewChild('seeMoreModal') seeMoreModal: ElementRef; 

  closeModal(): any {
    this.modal.dismissAll();
  }

  seeMore(cli:Cliente){
    this.cliSelected = cli;
    this.mostrar_alerta = false;
    this.modal.open(this.seeMoreModal);
  }

}
