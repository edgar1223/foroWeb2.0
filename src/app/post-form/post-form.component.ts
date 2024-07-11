import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../services/post-service.service';
import { Post } from '../models/post';
import {Materia} from '../models/materia/materia'
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  openPost(postId?: number): void {
    if (postId !== undefined && postId !== null) {
      this.router.navigate(['/post', postId]);
    } else {
      console.error('postId is undefined or null');
    }
  }

  postForm: FormGroup;
  similarPosts: Post[] = [];
  materias:Materia[]=[];
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private postService: PostService,
     private sanitizer: DomSanitizer
  ) {
    this.postForm = this.fb.group({
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
      materia: [null, [Validators.required, Validators.min(1)]],
      img: [null],
      archivo: [null]
    });
  }

  ngOnInit(): void {
    this.postForm.get('titulo')!.valueChanges.subscribe(value => this.searchSimilarPosts(value));
    this.postForm.get('contenido')!.valueChanges.subscribe(value => this.searchSimilarPosts(value));
    this.postService.searchMateria().subscribe(
      response => {
        this.materias = response;
      },
      error => {
        console.error('Error searching posts', error);
      }
    );
  }

  onFileChange(event: any, fileType: string): void {
    if (event.target.files.length > 0) {
      if (fileType === 'img') {
        this.postForm.patchValue({ img: event.target.files[0] });
      } else if (fileType === 'archivo') {
        this.postForm.patchValue({ archivo: event.target.files[0] });
      }
    }
  }

  createPost(): void {
    if (this.postForm.invalid) {
      return;
    }
    const formValue = this.postForm.value;
    const post: Post = {
      titulo: formValue.titulo,
      contenido: formValue.contenido,
      materia: formValue.materia,
      img: formValue.img,
      archivo: formValue.archivo
    };
   
    this.postService.createPost(post).subscribe(
      response => {
        console.log('Post created successfully', response);
        this.router.navigate(['/post', response.id]);
      },
      error => {
        console.error('Error creating post', error);
      }
    );
  }

  searchSimilarPosts(query: string): void {
    if (query) {
      this.postService.searchPosts(query).subscribe(
        response => {
          this.similarPosts = response;
        },
        error => {
          console.error('Error searching posts', error);
        }
      );
    } else {
      this.similarPosts = [];
    }
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
