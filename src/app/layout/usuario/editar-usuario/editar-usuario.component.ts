import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Rol } from 'src/app/models/rol.model';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'modal-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit, OnChanges{

  @Input() idUsuario : number;
  usu : Usuario;
  opacarDateFechaNacimiento: boolean = true;
  roles: Rol []= [];
  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    public modal: NgbModal,
    public configModal: NgbModalConfig,
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.obtenerUsuario(changes['idUsuario'].currentValue);

  }

  ngOnInit(): void {
 }
  cargando = false;
  modalIn = false;
  mensaje_alerta: string;
  mostrar_alerta: boolean = false;
  tipo_alerta: string;

  //Variables para ocultar la contraseña
  PASSWORD_CURRENT_ICON = 'fa fa-eye-slash';
  PASSWORD_CURRENT_TYPE = 'password';
  newUser = new Usuario();

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

  obtenerUsuario(idUsu : number):void{
    this.usuarioService.getUserById(idUsu).subscribe(
      data=>{
        this.usu = data.resultado;
        console.log(this.usu);
      },
      error=>{
      
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
  cambiarVistaContrasena() { // CAMBIA DE ICONO Y DE TIPO EN LA CONSTRASEÑA
    if (this.PASSWORD_CURRENT_ICON === 'fa fa-eye-slash') {
      this.PASSWORD_CURRENT_ICON = 'fa fa-eye';
      this.PASSWORD_CURRENT_TYPE = 'text';
    } else {
      this.PASSWORD_CURRENT_ICON = 'fa fa-eye-slash';
      this.PASSWORD_CURRENT_TYPE = 'password';
    }
  }
  cambiarDeStyleDate() {
    this.opacarDateFechaNacimiento = false;
  }
  /*createUser(){
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
  }*/
}
