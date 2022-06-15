import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  USE_USUARIO : any;
  USE_NAMES: any;
  USE_ID: any;
  //Formularios reactivos
  userForm: FormGroup;

  //Variables de alerta
  mostrar_alerta:boolean;
  mensaje_alerta:string;
  tipo_alerta:string;
  //variables de carga
  cargando:boolean = false;

  //Declara objeto usuario
  usuario: Usuario;
  userUp: Usuario;

  //Variables para ocultar la contraseña
  PASSWORD_CURRENT_ICON = 'fa fa-eye-slash';
  PASSWORD_CURRENT_TYPE = 'password';
  constructor(
    private storageService:StorageService,
    private formBuilder: FormBuilder,
    private userService: UsuarioService,
    private authService:AuthService
  ) { }

  ngOnInit(): void {
    this.USE_USUARIO = this.storageService.getString('USE_USUARIO');
    this.USE_NAMES = this.storageService.getString('USE_NAMES');
    this.USE_ID = this.storageService.getString('USE_ID');
    this.inicializarFormulario();
    this.getUserById();
  }
  inicializarFormulario(){
    this.userForm = this.formBuilder.group({
      user:['',[Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/), Validators.maxLength(60)]],
      contrasena: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      nombres: ['', [Validators.required, Validators.pattern('[a-zñáéíóú A-ZÑÁÉÍÓÚ ]+'), Validators.maxLength(50)]],
      apellido_paterno: ['', [Validators.required, Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ]+'), Validators.maxLength(30)]],
      apellido_materno: ['', [Validators.required, Validators.pattern('[a-zñáéíóúA-ZÑÁÉÍÓÚ]+'), Validators.maxLength(30)]],
      sexo: ['',[Validators.required]]
    });
  }

  getUserById(){
    this.cargando = true;
    this.userService.getUserById(+this.USE_ID).subscribe(
      data=>{
        this.usuario = data.user;
        this.asignarCamposForm();
        this.cargando = false;
      },error=>{
        this.cargando = false;

      }
    )
  }

  asignarCamposForm(){
    this.user!.setValue(this.usuario.USU_USUARIO);
    this.email!.setValue(this.usuario.USU_EMAIL);
    this.nombres!.setValue(this.usuario.USU_NOMBRES);
    this.contrasena!.setValue('');
    this.apellido_paterno!.setValue(this.usuario.USU_APELLIDO_PATERNO);
    this.apellido_materno!.setValue(this.usuario.USU_APELLIDO_MATERNO);
    if(this.usuario.USU_SEXO == 'M'){
      this.sexo!.setValue(1);
    }else if(this.usuario.USU_SEXO == 'F') this.sexo!.setValue(0);
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
  get sexo(){
    return this.userForm.get('sexo');
  }

  userUpdate(){
    this.mostrar_alerta = false;
    this.cargando = true;
    this.usuario.USU_USUARIO = this.user!.value;
    this.usuario.USU_EMAIL = this.email!.value;
    this.usuario.USU_CONTRASENIA = this.contrasena!.value;
    this.usuario.USU_NOMBRES = this.nombres!.value;
    this.usuario.USU_APELLIDO_PATERNO = this.apellido_paterno!.value;
    this.usuario.USU_APELLIDO_MATERNO = this.apellido_materno!.value;
    if(this.sexo!.value==0)
      this.usuario.USU_SEXO = 'F';
    else if(this.sexo!.value == 1)
      this.usuario.USU_SEXO = 'M';
    this.userService.updateProfile(this.usuario).subscribe(
      (data)=>{
        this.updateAuthorization();
      },
      (error)=>{
        this.mostrar_alerta = true;
        this.tipo_alerta='danger';
        this.cargando = false;
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
            this.mensaje_alerta = 'Hubo un error al actualizar el usuario, Por favor, actualice la página o inténtelo más tarde.';
          } else if (error.error.error === 'error_deCampo'){
            this.mensaje_alerta = 'Hubo un error al intentar ejecutar su solicitud. Por favor, revise los campos ingresados.';
          } else if(error.error.error === 'error_existenciaUsuarioId'){
            this.mensaje_alerta = 'Hubo un problema al verificar la existencia del usuario. Por favor, vuelva a intentar o actualice la página.';
          }
        }
        else{
          this.mensaje_alerta = 'Hubo un error al mostrar la información de esta página. Por favor, actualice la página o inténtelo más tarde.';
        }
      }
    );
  }

  updateAuthorization(){ 
    
    if(this.contrasena!.value.length != 0){
      this.tipo_alerta = 'warning';
      this.mostrar_alerta = true;
      this.mensaje_alerta = 'Usuario actualizado correctamente. Espere un momento mientras se actualizan los permisos.';
      this.authService.login(this.user!.value,this.contrasena!.value).subscribe(
        respuesta=>{
          this.cargando = false;
          if (respuesta.exito) {
            
            this.storageService.storeString('USE_USUARIO', this.user!.value.toLowerCase());    // Nombre de usuario (alias)
            this.storageService.storeString('USE_ID', respuesta.id);      // Es el ID de usuario
            this.storageService.storeString('USE_NAMES', respuesta.fullName);   // Concatenación de nombres y apellidos
            this.storageService.storeString("USE_EMAIL", respuesta.email); //email del cliente
            this.tipo_alerta = 'success';
            this.mensaje_alerta = 'Usuario actualizado correctamente.';
            this.mostrar_alerta = true;
          }else {
            this.mostrar_alerta = true;
            this.tipo_alerta='danger';
            this.mensaje_alerta = 'Las credenciales ingresadas son incorrectas. Por favor, intenta nuevamente';
          }
          this.cargando  = false;
        },
        error=>{
          this.cargando  = false;
          this.mostrar_alerta = true;
          this.tipo_alerta='danger';
          this.mensaje_alerta = "Hubo un error al validar tus credenciales. Por favor, intenta nuevamente";
        }
      );
    }else{
      this.storageService.storeString('USE_USUARIO', this.user!.value.toLowerCase());    // Nombre de usuario (alias)
      this.storageService.storeString('USE_ID', this.usuario.USU_ID.toString());      // Es el ID de usuario
      this.storageService.storeString('USE_NAMES', this.nombres!.value+' '+this.apellido_paterno!.value+' '+this.apellido_materno!.value);   // Concatenación de nombres y apellidos
      this.storageService.storeString("USE_EMAIL", this.email!.value); //email del cliente
      this.tipo_alerta = 'success';
      this.mostrar_alerta = true;
      this.cargando  = false;
      this.mensaje_alerta = 'Usuario actualizado correctamente.';
    }
  }
}
