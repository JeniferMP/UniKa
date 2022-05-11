import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Rol } from 'src/app/models/rol.model';
import { Usuario } from 'src/app/models/usuario.model';
import { FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { StorageService } from 'src/app/services/storage.service';
import { RolService } from 'src/app/services/rol.service';
import { compare, SorteableDirective } from 'src/app/shared/directives/sorteable.directive';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  usuarios: Usuario []=[];
  usuariosObtenidos: any[]=[];
  roles: Rol []= [];
  sexo: any;
  opacarDateFechaNacimiento: boolean = true;
  USU_ID: any;
  datePipe: any;
  IdUsuario : number = 0;

  userForm : FormGroup = this.formBuilder.group({
    user:['',[Validators.required, Validators.maxLength(60)]],
    email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/), Validators.maxLength(60)]],
    contrasena: ['', [Validators.minLength(8), Validators.maxLength(20)]],
    nombres: ['', [Validators.required, Validators.pattern('[a-zñáéíóú A-ZÑÁÉÍÓÚ ]+'), Validators.maxLength(50)]],
    apellido_paterno: ['', [Validators.required, Validators.pattern('^[a-zñáéíóúA-ZÑÁÉÍÓÚ ]+$'), Validators.maxLength(30)]],
    apellido_materno: ['', [Validators.required, Validators.pattern('^[a-zñáéíóúA-ZÑÁÉÍÓÚ ]+$'), Validators.maxLength(30)]],
    fecha_nacimiento: ['', [Validators.required ]],
    celular: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(9), Validators.minLength(9)]] ,
    dni: ['', [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(8),  Validators.maxLength(8)]],
    direccion: ['', [Validators.required , Validators.pattern('^[a-zñáéíóú#°/,. A-ZÑÁÉÍÓÚ  0-9]+$'), Validators.maxLength(100)]],
    rol:['',[Validators.required]],
    sexo:['']
  });

  constructor(private formBuilder: FormBuilder,
    public modal: NgbModal,
    public configModal: NgbModalConfig,
    private usuarioService: UsuarioService,
    //private datePipe: DatePipe,
    private storageService:StorageService,
    private rolService: RolService) {
      configModal.backdrop = 'static';
      configModal.keyboard = false;
      configModal.size = 'lg'
    }
  
    filtroTexto:string = '';
    userSelected = new Usuario(); 
    newUser = new Usuario();
    currentPage = 1;
    itemsPerPage = 50;

    //Variables de cargando y error
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;

  //Variables para ocultar la contraseña
  PASSWORD_CURRENT_ICON = 'fa fa-eye-slash';
  PASSWORD_CURRENT_TYPE = 'password';

  //USU_ID: string='' ;

  @ViewChild('editUserModal') editUserModal: ElementRef;
  //modal para crear un usuario
  @ViewChild('createUserModal') createUserModal: ElementRef;
  //modal para visualizar un usuario
  @ViewChild('seeMoreModal') seeMoreModal: ElementRef; 
  
  ngOnInit(): void {
    this.inicializarFormulario();
    this.listarUsuario();
    this.listarRoles();
    this.USU_ID = this.storageService.getString('USE_ID');
  }

  inicializarFormulario(){
   this.userForm.reset();
  }



  get user() {
    return this.userForm.get('user');
  }
  get email() {
    return this.userForm.get('email');
  }
  get contrasena() {
    return this.userForm.get('contrasena');
  }
  get nombres() {
    return this.userForm.get('nombres');
  }
  get apellido_paterno() {
    return this.userForm.get('apellido_paterno');
  }
  get apellido_materno() {
    return this.userForm.get('apellido_materno');
  }
  get fecha_nacimiento() {
    return this.userForm.get('fecha_nacimiento');
  }
  get celular() {
    return this.userForm.get('celular');
  }
  get dni() {
    return this.userForm.get('dni');
  }
  get direccion() {
    return this.userForm.get('direccion');
  }
  get rol() {
    return this.userForm.get('rol');
  }
  get sexo_(){
    return this.userForm.get('sexo');
  }
  
  obtenerSexo(sexo: string) {
    this.sexo = sexo;
  } 
  

  listarUsuario(){
    this.cargando=true;
    this.mostrar_alerta=false;
    this.usuarioService.listarUsuario().subscribe(
      data=>{
        this.usuariosObtenidos = data.resultado;
        this.usuarios = this.usuariosObtenidos.slice();
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
  
  listarRoles(){
    this.rolService.listRols().subscribe(
      data=>{
        this.roles = data.resultado;
        console.log(this.roles);
      }
      ,error=>{
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

  closeModal(): any {
    this.modal.dismissAll();
  }

  registerUserModal(){
    this.mostrar_alerta = false;
    this.inicializarFormulario();
    this.modal.open(this.createUserModal);
  }

  createUser(){
    this.cargando = true;
    if(this.userForm.invalid){
      this.modalIn = true;
      this.mostrar_alerta = true;
      this.cargando = false;
      this.tipo_alerta = 'danger';
      this.mensaje_alerta = 'Los datos ingresados son invalidos. Por favor, vuelva a intentarlo.';
    }else{
      this.modalIn = true;
      this.newUser.USU_NOMBRES = this.nombres!.value;
      this.newUser.USU_APELLIDO_PATERNO = this.apellido_paterno!.value;
      this.newUser.USU_APELLIDO_MATERNO = this.apellido_materno!.value;
      this.newUser.USU_USUARIO = this.user!.value;
      this.newUser.USU_EMAIL = this.email!.value;
      this.newUser.USU_SEXO = this.sexo;
      this.newUser.USU_CELULAR = this.celular!.value;
      this.newUser.USU_DIRECCION = this.direccion!.value;
      this.newUser.USU_FECHA_NACIMIENTO = this.fecha_nacimiento!.value;
      this.newUser.USU_CONTRASENIA = this.contrasena!.value;
      this.newUser.USU_DNI = this.dni!.value;
      this.newUser.USU_ESTADO = 1; //Habilitado(1) / Deshabilitado(0) / Cambio de contraseña (2) 
      this.newUser.ROL_ID = this.rol!.value;
      this.usuarioService.registerUser(this.newUser).subscribe(
        data=>{
          if(data.exito){
            this.modalIn = false;
            this.closeModal();
            this.mensaje_alerta = 'Usuario registrado con éxito.';
            this.tipo_alerta = 'success';
            this.mostrar_alerta = true;
            this.listarUsuario();
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
            } else if (error.error.error === 'error_emailExistente'){
              this.mensaje_alerta = 'El correo electrónico ya le pertenece a una cuenta. Por favor, ingrese uno diferente.';
            } else if (error.error.error === 'error_nombreUsuarioExistente'){
              this.mensaje_alerta = 'El nombre de usuario ya le pertenece a una cuenta, Por favor, ingrese uno diferente.';
            } else if (error.error.error === 'error_dniExistente'){
              this.mensaje_alerta = 'El DNI ya le pertenece a una cuenta, Por favor, ingrese uno diferente.';
            } else if (error.error.error === 'error_celularExistente'){
              this.mensaje_alerta = 'El número de celular ya le pertenece a una cuenta, Por favor, ingrese uno diferente.';
            } else if (error.error.error === 'error_ejecucionQuery'){
              this.mensaje_alerta = 'Hubo un error al registrar el usuario, Por favor, actualice la página o inténtelo más tarde.';
            } else if (error.error.error === 'error_deCampo'){
              this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, revise los campos ingresados.';
            }
          }
          else{
            this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página o inténtelo más tarde.';
          }
        }
      )
    }
  }

  habilitarInhabilitarUsuario(USU_ID:number,USU_ESTADO:number){
    this.cargando = true;
    
    this.modalIn = false;
    if(USU_ESTADO == 0){
      USU_ESTADO = +1; 
      this.mensaje_alerta = 'Se habilitó el usuario satisfactoriamente.';
    }else{
      USU_ESTADO = +0; 
      this.mensaje_alerta = 'Se inhabilitó el usuario satisfactoriamente.'

    }
    
    this.usuarioService.habilitarInhabilitarUsuarios(USU_ID,USU_ESTADO).subscribe(data=>
      {
        this.listarUsuario();
        this.tipo_alerta = 'success';
        this.mostrar_alerta = true; 
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
  usuar_editar : Usuario = new Usuario();
  editUser(usuario:any){
    this.IdUsuario= usuario.USU_ID;
    this.usuar_editar = usuario;
    /*console.log(this.usuar_editar);
    this.mostrar_alerta = false;
    this.user!.setValue(usuario.USU_USUARIO);
    this.email!.setValue(usuario.USU_EMAIL);
    this.nombres!.setValue(usuario.USU_NOMBRES);
    this.contrasena!.setValue('');
    console.log(usuario.USU_FECHA_NACIMIENTO);
    this.fecha_nacimiento!.setValue(this.datePipe.transform(usuario.USU_FECHA_NACIMIENTO, 'yyyy-MM-dd'));
    console.log(this.fecha_nacimiento!.value);
    this.direccion!.setValue(usuario.USU_DIRECCION);
    this.apellido_paterno!.setValue(usuario.USU_APELLIDO_PATERNO);
    this.apellido_materno!.setValue(usuario.USU_APELLIDO_MATERNO);
    this.celular!.setValue(usuario.USU_CELULAR);
    this.dni!.setValue(usuario.USU_DNI);
    this.rol!.setValue(usuario.ROL_ID);

    if(usuario.USU_SEXO == 'M'){
      this.sexo.setValue(1);
    }else if(usuario.USU_SEXO == 'F') this.sexo.setValue(0);
    this.modal.open(this.editUserModal);*/
  }

  updateUser(){
    this.mostrar_alerta = false;
    this.cargando = true;
    this.modalIn = true;
    this.usuar_editar.USU_NOMBRES = this.nombres!.value;
    this.usuar_editar.USU_APELLIDO_PATERNO = this.apellido_paterno!.value;
    this.usuar_editar.USU_APELLIDO_MATERNO = this.apellido_materno!.value;
    this.usuar_editar.USU_USUARIO = this.user!.value;
    this.usuar_editar.USU_EMAIL = this.email!.value;
    this.usuar_editar.USU_SEXO = this.sexo;
    this.usuar_editar.USU_CELULAR = this.celular!.value;
    this.usuar_editar.USU_DIRECCION = this.direccion!.value;
    this.usuar_editar.USU_FECHA_NACIMIENTO = this.fecha_nacimiento!.value;
    this.usuar_editar.USU_CONTRASENIA = this.contrasena!.value;
    this.usuar_editar.USU_DNI = this.dni!.value;
    this.usuar_editar.ROL_ID = this.rol!.value;
    this.usuarioService.updateUser(this.usuar_editar).subscribe(
      (data)=>{
        this.cargando = false;
        this.modalIn = false;
        this.closeModal();
        this.mensaje_alerta = 'Usuario actualizado con éxito.';
        this.tipo_alerta = 'success';
        this.mostrar_alerta = true;
        this.listarUsuario();
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
          } else if (error.error.error === 'error_emailExistente'){
            this.mensaje_alerta = 'El correo electrónico ya le pertenece a una cuenta. Por favor, ingrese uno diferente.';
          } else if (error.error.error === 'error_nombreUsuarioExistente'){
            this.mensaje_alerta = 'El nombre de usuario ya le pertenece a una cuenta, Por favor, ingrese uno diferente.';
          } else if (error.error.error === 'error_dniExistente'){
            this.mensaje_alerta = 'El DNI ya le pertenece a una cuenta, Por favor, ingrese uno diferente.';
          } else if (error.error.error === 'error_celularExistente'){
            this.mensaje_alerta = 'El número de celular ya le pertenece a una cuenta, Por favor, ingrese uno diferente.';
          } else if (error.error.error === 'error_ejecucionQuery'){
            this.mensaje_alerta = 'Hubo un error al registrar el usuario, Por favor, actualice la página o inténtelo más tarde.';
          } else if (error.error.error === 'error_deCampo'){
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, revise los campos ingresados.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página o inténtelo más tarde.';
        }
      }
    )
  }

  searchUser(){
    if(this.usuarios.length<0){
      this.mensaje_alerta = 'No existen usuarios registrados, registre uno y vuelva a intentarlo.';
      this.tipo_alerta = 'danger';
      this.mostrar_alerta = true;
      return;
    }else{
      //Realizar búsqueda de usuario
    }
  }

  seeMore(user:Usuario){
    this.userSelected = user;
    this.mostrar_alerta = false;
    this.modal.open(this.seeMoreModal);
  }
  cambiarVistaContrasena() { // CAMBIA DE ICONO Y DE TIPO EN LA CONSTRASEÑA
    if (this.PASSWORD_CURRENT_ICON === 'fa fa-eye-slash') {
      this.PASSWORD_CURRENT_ICON = 'fa fa-eye';
      this.PASSWORD_CURRENT_TYPE = 'text';
    } else {
      this.PASSWORD_CURRENT_ICON = 'fa fa-eye-slash';
      this.PASSWORD_CURRENT_TYPE = 'password';
    }
  }
  getTodayFechaNacimiento(): string {
    const fechaActual = this.datePipe.transform(new Date(), 'yyyy-MM-dd').split('-');
    const dia = fechaActual[2];
    const mes = fechaActual[1];
    const anio = Number(fechaActual[0]) - 18;
    const fechaMaxima = anio + '-' + mes + '-' + dia;

    return new Date(fechaMaxima).toISOString().split('T')[0] ;
  }
  cambiarDeStyleDate() {
    this.opacarDateFechaNacimiento = false;
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
      this.usuarios = this.usuariosObtenidos.slice();
    } else {
      this.usuarios = [...this.usuariosObtenidos].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }


}
