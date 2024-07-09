import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  conutProfesor():Observable<any>{
    const token = this.getToken();
    return this.http.get<any>(`${this.apiUrl}/analisis/profesores?toke=${token}`);
  }
  registrarLista(file:File):Observable<any[]>{
    const formData: FormData = new FormData();
    formData.append('file',file, file.name);
    return this.http.post<any[]>(`${this.apiUrl}/usuarios/upload`,formData);
  }
}
