import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../services/post-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Post } from '../models/post';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent {
  post!: any;
  comments: any[] = [];
  commentForm: FormGroup;
   apiUrl = environment.apiImg;
   sanitizedPdfUrl!: SafeResourceUrl;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
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
     
     
    }
   
  }

  loadPostDetails(id: number): void {
    this.postService.getPostById(id).subscribe(post => {
      this.post = post;
      this.sanitizedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiUrl+this.post.archivo);
      console.log('datalles ', this.post)
    });
  }

  loadComments(postId: number): void {
    this.postService.getComments(postId).subscribe(comments => {
      this.comments = comments;
    });
  }

  onCommentSubmit(): void {
    const postId = this.post.id;
    const formData = new FormData();
    formData.append('titulo', this.commentForm.get('titulo')?.value);
    formData.append('descripcion', this.commentForm.get('descripcion')?.value);
    if (this.commentForm.get('img')?.value) {
      formData.append('img', this.commentForm.get('img')?.value);
    }

    this.postService.addComment(postId, formData).subscribe(comment => {
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
