import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class authLoginGuard implements CanActivate {

  
  constructor( private router: Router) { }
  token: string | null | undefined;
  canActivate(): boolean {
    // Verificar si el token está presente en el localStorage
    if (typeof localStorage !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
    if (!this.token) {
      // this.router.navigate(['/login']);
      console.log('entro true');
      return true;
    } else {      
      console.log('entro false');
        this.router.navigate(['/inicio']);
        return false;
      
    }
  }
}


