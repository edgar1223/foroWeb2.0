import { Component,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/user/usuario.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent  implements OnInit {
  user_type!:String;
salir() {
localStorage.removeItem('authToken');
localStorage.removeItem('id');
this.user.clearUserType();
this.router.navigate(["/"]);
}
  isUserMenuOpen = false;
constructor(private router: Router, private user:UsuarioService){}
  ngOnInit(): void {
  
  const userType = this.user.getUserType();
  if (userType !== null) {
    this.user_type = userType;
  }
  }
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
  
}
