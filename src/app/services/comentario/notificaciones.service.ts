import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  notificaciones():Observable<any>{
    const token=this.getToken();
    return this.http.get<any>(`${this.apiUrl}/usuarios/notificaciones?token=${token}`)
  }
  updateNotificaciones(notificaciones:number):Observable<any>{
    const token=this.getToken();
    return this.http.get<any>(`${this.apiUrl}/usuarios/notificaciones/${notificaciones}?token=${token}`)  
  }
}
