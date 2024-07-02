import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../services/user/usuario.service';
import { Departamentos } from '../models/Departamentos/departamentos';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('slideIn', [
      state('in', style({ transform: 'translateX(0)', opacity: 1 })),
      state('out', style({ transform: 'translateX(-100%)', opacity: 0 })),
      transition('out => in', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-in', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition('in => out', [
        animate('300ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ]),
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
      transition('out => in', [
        animate('300ms ease-in')
      ]),
      transition('in => out', [
        animate('300ms ease-out')
      ])
    ]),
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(100)' })),
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    registerForm: FormGroup;
    loading: boolean = false; 
    currentTab: number = 0; 
    errorMessage: string = '';
    departamentos:Departamentos[]=[]
    constructor(private fb: FormBuilder, private router: Router,private user:UsuarioService
      , private authService: AuthService) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      });
  
      this.registerForm = this.fb.group({
        control: ['', Validators.required],
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        email2: ['', [Validators.required, Validators.email]],
        semestre: ['', [Validators.required, Validators.min(1)]],
        departamento:['', [Validators.required, Validators.min(1)]],
        contrase: ['', [Validators.required, Validators.minLength(6)]]
      });
    }
  
    ngOnInit(): void {
      this.authService.getAlldepartamentos().subscribe(response=>{
        this.departamentos=response
        console.log(response)
      },
      error => {
        console.error('departamentos', error.message);
      }
      );
    }
  
    onRegistro() {
      this.errorMessage = '';
      if (this.registerForm.invalid) {
        
          this.errorMessage = 'Completa el formulario';
          return;
        
      }
      this.loading = true;
      const { control, nombre, apellido, email2, semestre, contrase,departamento } = this.registerForm.value;
  
      this.authService.RegistroAlumno(control, nombre, apellido, email2, semestre, contrase,departamento).subscribe(
        response => {
          this.authService.login(email2, contrase).subscribe(
            response => {
              const token = response.token.token;
          const userType=response.usuario.Tipo;
          this.user.setUserType(userType);
          localStorage.setItem('authToken', token);
          this.router.navigate(['/inicio']);
            },
            error => {
              this.handleLoginError(error);
            }
          );
        },
        error => {
          this.handleRegistrationError(error);
        }
      ).add(() => {
        this.loading = false;
      });
    }
  
    onLogin() {
      this.errorMessage = '';
      if (this.loginForm.invalid) {
        this.errorMessage = 'Completa el formulario';
        return;
      }
      this.loading = true;
      const { email, password } = this.loginForm.value;
  
      this.authService.login(email, password).subscribe(
        response => {
          const token = response.token.token;
          const userType=response.usuario.Tipo;
          this.user.setUserType(userType);
          localStorage.setItem('authToken', token);
          this.router.navigate(['/inicio']);
        },
        error => {
          console.error('Inicio de sesión fallido', error.message);
          this.errorMessage = 'Error al iniciar sesión. Por favor, verifica tus credenciales e inténtalo de nuevo.';
        }
      ).add(() => {
        this.loading = false;
      });
     
    }

  private handleRegistrationError(error: any): void {
    if (error && error.error && typeof error.error === 'string') {
      if (error.error.includes('/')) {
        const errors = error.error.split('/');
        this.errorMessage = errors.join('<br>');
      } else {
        this.errorMessage = error.error;
      }
    } else {
      console.error('Registro fallido:', error);
      this.errorMessage = 'Error al registrar. Por favor, inténtalo de nuevo más tarde.';
    }
    this.loading = false; // Asegúrate de ocultar el indicador de carga en caso de error
  }

  private handleLoginError(error: any): void {
    console.error('Inicio de sesión fallido:', error);
    this.errorMessage = 'Error al iniciar sesión. Por favor, verifica tus credenciales e inténtalo de nuevo.';
    this.loading = false; // Asegúrate de ocultar el indicador de carga en caso de error
  }
  changeTab(tabIndex: number): void {
    this.currentTab = tabIndex;
    
  }
}
