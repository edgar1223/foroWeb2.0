import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post-service.service';
import { Chart, registerables } from 'chart.js'; // Importa registerables
import { User } from '../models/usuario/user';
import { UsuarioService } from '../services/user/usuario.service';
import { Post } from '../models/post';
import { Router } from '@angular/router';
import { MateriaRecurentes } from '../models/usuario/materia-recurentes';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Message } from 'primeng/api';
import * as AOS from 'aos';
import { IaService } from '../services/analisis/ia.service';
import { AnalysisResult } from '../models/analysis-result';
import { error } from 'console';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  rol: any;

  messages!: Message[];
  postForm: FormGroup;
  img: File | null = null;
  onFileChange(event: any) {
    this.img = event.target.files[0];
  }
  profileImg: string = 'assets/profile-placeholder.png';
  profileName: string = '';
  profileEmail: string = '';
  posts: Post[] | undefined = [];
  chart: any;
  user!: User;
  materiasRecurrentes: MateriaRecurentes[] = [];
  editar: boolean = false;
  materiasAnalisadas!:AnalysisResult;
  data: any;
  options: any;
  PostBandera:boolean=false;
  constructor(
    private fb: FormBuilder,
    private analisis:IaService,
    private usuarioServices: UsuarioService,
    private postService: PostService,
    private router: Router
    , private sanitizer: DomSanitizer
  ) {
    this.postForm = this.fb.group({
      img: [null],
    });
    Chart.register(...registerables); // Registra los componentes de Chart.js
  }

  ngOnInit(): void {
    this.loadProfile();
    this.rol = this.usuarioServices.getUserType();

    this.loadPosts();

   


  }

  loadProfile() {
    this.usuarioServices.UsuarioByID().subscribe((user) => {
      this.user = user;
      console.log("usuario",this.user);
    });
  }

  loadPosts() {
    this.usuarioServices.PostByUsuariId().subscribe((respuesta) => {
      this.posts = respuesta || []; 
      this.loadChart();
      this.analisiMaterias();
      this. tendencias();
      this.grafica();
      this.PostBandera=true
    });
  }

  loadChart() {
    this.usuarioServices.MaterRecurrentes().subscribe((respuesta) => {
      this.materiasRecurrentes = respuesta || []; // Inicializa como un arreglo vacío si response es undefined
      
    });
  }

 

  openPost(postId?: number): void {
    console.log(postId);
    if (postId !== undefined && postId !== null) {
      this.router.navigate(['/post', postId]);
    } else {
      console.error('postId is undefined or null');
    }
  }

  save() {
    if (!this.user.nombre || !this.user.apellido || !this.user.email || !this.user.password) {
      this.messages = [
        {
          severity: 'error',
          summary: 'Error',
          detail: 'Todos los campos son obligatorios',
        },
      ];
      return;
    }
    this.usuarioServices.updateUser(this.user, this.img).subscribe(
      (response) => {
        console.log('error', this.user.password);
        this.loadProfile();

        this.messages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Message Content',
          },
        ];
      },
      (error) => {
        console.error('Error updating user', error);
      }
    );

    this.editar = false;
  }
  OpenEdit() {
    this.editar = true;
  }
  getExcerpt(content: string): string {
    const maxLength = Math.ceil(content.length * 0.25);
    return content.length > maxLength
      ? content.substring(0, maxLength) + '...'
      : content;
  }
  analisiMaterias(){
    this.analisis.analisisPost().subscribe(repuesta=>{
      this.materiasAnalisadas=repuesta;
      console.log(repuesta)
    },error=>{
      console.log(error)
    })
    
  }
  tendencias(){
    this.analisis.comportamiento().subscribe(data=>{
      this.data = {
        labels: data.labels,
        datasets: data.datasets.map((dataset: any) => ({
          label: dataset.label,
          data: dataset.data.map((d: any) => ({
            x: d.date,
            y: d.count
          })),
          fill: false,
          borderColor: this.getRandomColor(),
          tension: 0.4
        }))
      };
    },error=>{
      console.log(error)
    })
  }
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  grafica(){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  extractFirstP(content: string): string {
    const div = document.createElement('div');
    div.innerHTML = content;
    const p = div.querySelector('p');
    if (p) {
      const text = p.textContent || '';
      return this.truncateText(text, 25); // Truncar al 25%
    }
    return '';
  }

  truncateText(text: string, percentage: number): string {
    const length = Math.floor(text.length * (percentage / 100));
    return text.substring(0, length) + (text.length > length ? '...' : '');
  }
}
