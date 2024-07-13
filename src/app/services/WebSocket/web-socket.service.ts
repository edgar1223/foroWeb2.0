import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private commentSubject = new Subject<any>();

  constructor(private http: HttpClient) {
    this.initializeWebSocketConnection();
  }

  private async initializeWebSocketConnection() {
    try {
      const id = await this.getUserIdFromToken();
      console.log('ID obtenido:', id);
      this.connect(id);
    } catch (error) {
      console.error('Error al obtener el ID del usuario:', error);
    }
  }

  private connect(id: number) {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected: ' + frame);
      this.stompClient.subscribe(`/topic/comments/${id}`, (message: any) => {
        console.log('Received message: ', message);
        try {
          const comment = JSON.parse(message.body);
          console.log('Parsed comment: ', comment); // Agregar esta línea para ver el objeto completo
          if (comment && comment.post) {
            this.commentSubject.next(comment);
          } else {
            console.error('Invalid comment format: ', comment);
          }
        } catch (error) {
          console.error('Error parsing message body: ', error);
        }
      });
    });
  }

  getCommentNotifications() {
    return this.commentSubject.asObservable();
  }

  private getUserIdFromToken(): Promise<number> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        this.http.get<any>(`http://localhost:8080/api/usuarios/id?token=${token}`).subscribe(
          respuesta => {
            resolve(respuesta.id);
          },
          error => {
            reject(error);
          }
        );
      } else {
        reject('No token found');
      }
    });
  }
}
