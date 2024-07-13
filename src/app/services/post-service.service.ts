import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post';
import {Materia} from '../models/materia/materia'
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/post/post';
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  constructor(private http: HttpClient) {}

  createPost(post: Post): Observable<Post> {
    
    const token=localStorage.getItem('authToken');
    const formData: FormData = new FormData();
    formData.append('titulo', post.titulo);
    formData.append('contenido', post.contenido);
    formData.append('materiaId', post.materia?.id?.toString() || '');
  //  formData.append('usuarioId',"87654321");
    if (post.img) {
      formData.append('img', post.img, post.img.name);
    }
    if (post.archivo) {
      formData.append('archivo', post.archivo, post.archivo.name);
    }
   
    return this.http.post<Post>(`${this.apiUrl}?token=${token}`, formData);
  }
  searchPosts(query: string): Observable<Post[]> {
    return this.http.get<Post[]>(`http://localhost:8080/api/post/search?query=${query}`);
  }
  searchMateria(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`http://localhost:8080/api/materia/materia`);
  }
  getPostById(id: number): Observable<Post> {
    const token=this.getToken();
    return this.http.get<Post>(`http://localhost:8080/api/post/${id}?token=${token}`);
  }
  addComment(postId: number, comment: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${postId}/comments`, comment);
  }

  getComments(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${postId}/comments`);
  }
  getPostAll():Observable<Post[]>{
    return this.http.get<Post[]>("http://localhost:8080/api/post/post");
  }
}
