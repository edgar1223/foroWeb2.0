import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Comentario } from '../../models/comentario/comentario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  createComentarios(Comentario:Comentario):Observable<Comentario>{
    const token=this.getToken();
    const formData: FormData = new FormData();
    formData.append('titulo', Comentario.titulo);
    formData.append('contenido', Comentario.contenido);
    if (Comentario.post !== undefined) {
      formData.append('post', Comentario.post.toString());
  }

    if (Comentario.img) {
      formData.append('img', Comentario.img, Comentario.img.name);
    }
    if (Comentario.archivo) {
      formData.append('archivo', Comentario.archivo, Comentario.archivo.name);
    }
       // Imprimir el contenido del FormData en la consola usando forEach
       formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });
    return this.http.post<Comentario>(`${this.apiUrl}/comentario/comentarios?token=${token}`,formData)
  }
  loadPost(postId:number):Observable<Comentario[]>{
    const token=this.getToken();
    return this.http.get<Comentario[]>(`${this.apiUrl}/comentario/comentarios/${postId}?token=${token}`)

  }
}
