import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../services/post-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Post } from '../models/post';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Comentario } from '../models/comentario/comentario';
import { ComentarioService } from '../services/comentario/comentario.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
  providers: [DatePipe]
})
export class PostDetailComponent {
  post!: Post;
  comments: Comentario[] = [];
  commentForm: FormGroup;
   apiUrl = environment.apiImg;
   sanitizedPdfUrl!: SafeResourceUrl;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private comentarioServices:ComentarioService,
    private datePipe: DatePipe
  ) {
    this.commentForm = this.fb.group({
      titulo: [''],
      descripcion: [''],
      img: [null]
    });
  }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadPostDetails(+postId);
      this.loadComments(+postId);
     
    }
   
  }

  loadPostDetails(id: number): void {
    this.postService.getPostById(id).subscribe(posts => {
      this.post = posts;
     ;
      this.sanitizedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiUrl+this.post.archivo);
      this.post.fechaFormatted = this.datePipe.transform(this.post.fecha, 'medium');
      console.log('datalles ', this.post)
    });
  }

  loadComments(postId: number): void {
    this.comentarioServices.loadPost(postId).subscribe(comments => {
      console.log("Comentarios: ", comments);
      this.comments = comments.map(comment => ({
        ...comment,
        formattedDate: this.datePipe.transform(comment.fecha, 'medium') || undefined // Asegura que sea string | undefined
      }));
    });
  }
  
  

  onCommentSubmit(): void {
    if (this.commentForm.invalid) {
      return;
    }
    const postId = this.route.snapshot.paramMap.get('id');
    const formValue = this.commentForm.value;
    const Comentario: Comentario = {
      titulo: formValue.titulo,
      contenido: formValue.descripcion,
      post: Number(postId),
      img: formValue.img,
      archivo: formValue.archivo
    };
   

  this.comentarioServices.createComentarios( Comentario).subscribe(comment => {
      this.comments.push(comment);
      this.commentForm.reset();
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.commentForm.patchValue({
        img: file
      });
    }
  }
  
}
