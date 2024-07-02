import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post-service.service';
import { Chart, registerables } from 'chart.js'; // Importa registerables
import { User } from '../models/usuario/user';
import { UsuarioService } from '../services/user/usuario.service';
import { Post } from '../models/post';
import { Router } from '@angular/router';
import { MateriaRecurentes } from '../models/usuario/materia-recurentes';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
rol: any;
  save() {
    this.usuarioServices.updateUser(this.user, this.img).subscribe(
      response => {
        console.log('User updated successfully');
      },
      error => {
        console.error('Error updating user', error);
      }
    );

    this.editar = false;
  }
OpenEdit() {
this.editar=true
}
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
  editar:boolean=false;
  constructor(
    private fb: FormBuilder,

    private usuarioServices: UsuarioService,
    private postService: PostService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      img: [null],
      
    });
    Chart.register(...registerables); // Registra los componentes de Chart.js
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadPosts();
    this.loadChart();
    this.rol=this.usuarioServices.getUserType();
  }

  loadProfile() {
    this.usuarioServices.UsuarioByID().subscribe(user => {
      this.user = user;
      console.log(this.user);
    });
  }

  loadPosts() {
    this.usuarioServices.PostByUsuariId().subscribe(respuesta => {
      this.posts = respuesta || []; // Inicializa como un arreglo vacío si response es undefined
    });
  }

  loadChart() {
    this.usuarioServices.MaterRecurrentes().subscribe(respuesta => {
      this.materiasRecurrentes = respuesta || []; // Inicializa como un arreglo vacío si response es undefined
      this.createChart(); // Llama a createChart después de cargar los datos
    });
  }

  createChart() {
    const materiaNames = this.materiasRecurrentes.map(materia => materia.materiaNombre);
    const postCounts = this.materiasRecurrentes.map(materia => materia.postCount);

    this.chart = new Chart('materiaChart', {
      type: 'bar',
      data: {
        labels: materiaNames,
        datasets: [
          {
            label: 'Cantidad de Posts por materia',
            data: postCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
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

  
}
