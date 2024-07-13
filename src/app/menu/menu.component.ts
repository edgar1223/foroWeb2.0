import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/user/usuario.service';
import { WebSocketService } from '../services/WebSocket/web-socket.service';
import { NotificacionesService } from '../services/comentario/notificaciones.service';
import { Subscription } from 'rxjs';
import { Post } from '../models/post';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  user_type!: String;
  private commentSubscription!: Subscription;
  post?: Post;
  salir() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('id');
    this.user.clearUserType();
    this.router.navigate(['/']);
  }
  isUserMenuOpen = false;
  notificaciones: number = 0;
  constructor(
    private router: Router,
    private user: UsuarioService,
    private webSocketService: WebSocketService,
    private notificacionesService:NotificacionesService
  ) {}
  ngOnInit(): void {
    const userType = this.user.getUserType();
    if (userType !== null) {
      this.user_type = userType;
    }
    this.cargarNotificaciones();
    this.commentSubscription = this.webSocketService.getCommentNotifications().subscribe(comment => {
      
        alert("actualizcion")
       this.notificaciones=this.notificaciones+1;
        this.updateNotificaciones(this.notificaciones);
        this.showNotification('Nueva notificación', 'Has recibido un nuevo comentario');
    });
    this.requestNotificationPermission();
  }
  cargarNotificaciones(){
    this.notificacionesService.notificaciones().subscribe(data=>{
      this.notificaciones=data.notificaciones;
    })
  }
  updateNotificaciones(notificaciones:number){
    this.notificacionesService.updateNotificaciones(notificaciones);
  }
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
  ngOnDestroy(): void {
    if (this.commentSubscription) {
      this.commentSubscription.unsubscribe();
    }
  }
  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
          console.log('Permiso de notificación denegado');
        }
      });
    }
  }

  showNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
}
