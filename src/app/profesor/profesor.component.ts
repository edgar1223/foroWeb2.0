import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Departamentos } from '../models/Departamentos/departamentos';
import { User } from '../models/usuario/user';
import { UsuarioService } from '../services/user/usuario.service';
import { environment } from '../../environments/environment';
import { Pipe, PipeTransform } from '@angular/core';
import { Materia } from '../models/materia/materia';
import { PostService } from '../services/post-service.service';
import { ProfesorService } from '../services/user/profesor.service';
import { ChartData, ChartOptions } from 'chart.js';
import { error } from 'console';
@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.component.html',
  styleUrl: './profesor.component.css',
})
export class ProfesorComponent implements OnInit {
  formularioExcel: boolean = false;
  onRegister() {
    if (this.registerForm.invalid) {
      this.errorFormulario = 'Completa el formulario';
      return; // Salir del método si el formulario no es válido
    }
    const { id, nombre, apellido, email, password, departamento } =
      this.registerForm.value;
    const lista: number[] = [];
    for (let ac of this.ListaMaterias) {
      if (ac.id !== undefined) {
        lista.push(ac.id);
      }
    }

    this.usuarioservicios
      .setProfesor(id, nombre, apellido, email, lista, password, departamento)
      .subscribe(
        (reponse) => {
          this.profesores.push(reponse);
          this.formulario = false;
          this.exito = true;
        },
        (error) => {
          this.mensajeError = error.error;
          console.error('Error crear profesor', error);
          console.log(this.mensajeError);
        }
      );
  }
  errorFormulario: string | null = null;
  mensajeError: any = [];
  registerForm!: FormGroup;
  apiUrl = environment.apiImg;
  formulario: boolean = false;
  exito: boolean = false;
  profesores: User[] = [];
  filteredProfesores: User[] = [];
  departamentos: Departamentos[] = [];
  materias: Materia[] = [];
  ListaMaterias: Materia[] = [];
  selectedFile: File | null = null;
  mostrarErrores: boolean = false;

  data: any;
  options: any;
  uploadedFile: any = null;
  constructor(
    private materia: PostService,
    private formBuilder: FormBuilder,
    private usuarioservicios: UsuarioService,
    private depa: AuthService,
    private renderer: Renderer2,
    private servicesProfe: ProfesorService
  ) {}

  ngOnInit(): void {
    this.findAllProofesores();
    this.getAlldepartamentos();
    this.searchMateria(),
      (this.registerForm = this.formBuilder.group({
        id: ['', Validators.required],
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        departamento: ['', Validators.required],
        materia: ['', Validators.required],
      }));
    this.conutProfesor();
  }

  conutProfesor() {
    this.servicesProfe.conutProfesor().subscribe((repuesta) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
  
      // Filtrar la respuesta para excluir aquellos valores que son 0
      const filteredResponse = Object.entries(repuesta).filter(([key, value]) => value !== 0);
  
      // Separar las etiquetas y los valores después de filtrar
      const labels = filteredResponse.map(([key]) => key);
      const data = filteredResponse.map(([, value]) => value);
  
      // Generar colores únicos para cada barra
      const generateColors = (length: number) => {
        const colors = [];
        for (let i = 0; i < length; i++) {
          const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;
          colors.push(color);
        }
        return colors;
      };
  
      const backgroundColors = generateColors(labels.length);
      const hoverBackgroundColors = backgroundColors.map(color => color.replace('0.6', '0.8'));
  
      this.data = {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColors,
            hoverBackgroundColor: hoverBackgroundColors
          }
        ]
      };
  
      this.options = {
        cutout: '60%',
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        }
      };
    });
  }
  
  

  findAllProofesores() {
    this.usuarioservicios.findAllProofesores().subscribe(
      (response) => {
        console.log(response);
        this.profesores = response;
        this.filteredProfesores = response;
      },
      (error) => {}
    );
  }

  getAlldepartamentos() {
    this.depa.getAlldepartamentos().subscribe(
      (reponde) => {
        this.departamentos = reponde;
      },
      (error) => {
        console.error('profesores', error.message);
      }
    );
  }

  searchMateria() {
    this.materia.searchMateria().subscribe(
      (response) => {
        this.materias = response;
      },
      (error) => {
        console.error('Error searching posts', error);
      }
    );
  }

  applyFilter(event: Event, field: keyof User) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredProfesores = this.profesores.filter((profesor) => {
      const value = profesor[field];
      return (
        value !== undefined &&
        value
          .toString()
          .toLowerCase()
          .includes(filterValue.trim().toLowerCase())
      );
    });
  }

  resetFilters() {
    this.filteredProfesores = [...this.profesores];
    const inputs = document.querySelectorAll('input[pInputText]');
    inputs.forEach((input) => ((input as HTMLInputElement).value = ''));
  }
  abriFormulario() {
    this.formulario = true;
    this.formularioExcel = false;
  }
  abriFormulario2() {
    this.formulario = false;
    this.formularioExcel = true;
  }
  onInput(event: any): void {
    const input = event.target;
    let value = input.value;

    // Remove non-numeric characters
    value = value.replace(/[^0-9]/g, '');

    // Limit to 8 characters
    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    // Update the input value
    input.value = value;
    this.registerForm.get('control')?.setValue(value);
  }
  materiSelecionada(Mt: Materia) {
    this.ListaMaterias.push(Mt);
  }
  onMateriaChange(event: any) {
    const selectedMateriaId = event.value;
    const selectedMateria = this.materias.find(
      (materia) => materia.id === selectedMateriaId
    );
    if (selectedMateria) {
      this.materiSelecionada(selectedMateria);
    }
  }
  closeAlert(alertType: string): void {
    if (alertType === 'exito') {
      this.exito = false;
    } else if (alertType === 'errorFormulario') {
      this.errorFormulario = null;
    }
  }
  removeMateria(index: number) {
    this.ListaMaterias.splice(index, 1);
  }
  onUpload(event: any) {
    this.uploadedFile = event.files[0]; // Aceptar solo un archivo
  }
  sendFile() {
    if (!this.uploadedFile) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.uploadedFile, this.uploadedFile.name);
    this.servicesProfe.registrarLista(this.uploadedFile).subscribe(repuesta=>{
      console.log(repuesta)
      this.exito = true;
      this.findAllProofesores();
    },(error) => {
      this.mensajeError = Object.values(error.error);
      this.mostrarErrores = true; 
    }

  )
    
  
  }

cerrarErrores() {
  this.mostrarErrores = false;
}
}
