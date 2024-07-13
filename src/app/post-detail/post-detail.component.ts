import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../services/post-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Post } from '../models/post';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Comentario } from '../models/comentario/comentario';
import { ComentarioService } from '../services/comentario/comentario.service';
import { DatePipe } from '@angular/common';
import { WebSocketService } from '../services/WebSocket/web-socket.service';
import { Subscription } from 'rxjs';
import { NotificacionesService } from '../services/comentario/notificaciones.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [DatePipe]
})
export class PostDetailComponent implements OnInit, OnDestroy {
  private commentSubscription!: Subscription;
  post?: Post; // Cambiado para que sea opcional
  comments: Comentario[] = [];
  commentForm: FormGroup;
  apiUrl = environment.apiImg;
  sanitizedPdfUrl?: SafeResourceUrl; // Cambiado para que sea opcional
  notificaciones: number = 0;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private comentarioServices: ComentarioService,
    private datePipe: DatePipe,
    private webSocketService: WebSocketService,
    private notificacionesService:NotificacionesService
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
      this.cargarNotificaciones();
    }
    this.commentSubscription = this.webSocketService.getCommentNotifications().subscribe(comment => {
      if (comment && comment.post && comment.post.id === this.post?.id) {
        this.comments.push(comment);
        
        // this.updateNotificaciones(this.notificaciones);
      } else {
        console.error('Received invalid comment or post ID does not match:', comment);
      }
    });
  }
  
  cargarNotificaciones(){
    this.notificacionesService.notificaciones().subscribe(data=>{
      this.notificaciones=data.notificaciones;
    })
  }
  updateNotificaciones(notificaciones:number){
    this.notificacionesService.updateNotificaciones(notificaciones);
  }
  loadPostDetails(id: number): void {
    this.postService.getPostById(id).subscribe(posts => {
      this.post = posts;
      this.sanitizedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiUrl + this.post.archivo);
      this.post.fechaFormatted = this.datePipe.transform(this.post.fecha, 'medium');
    });
  }

  loadComments(postId: number): void {
    this.comentarioServices.loadPost(postId).subscribe(comments => {
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

    this.comentarioServices.createComentarios(Comentario).subscribe(comment => {
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

  ngOnDestroy(): void {
    if (this.commentSubscription) {
      this.commentSubscription.unsubscribe();
    }
  }
}
