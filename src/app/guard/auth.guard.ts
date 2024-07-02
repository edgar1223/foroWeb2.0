import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  
  constructor( private router: Router) { }
  token: string | null | undefined;
  canActivate(): boolean {
    if (typeof localStorage !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
    if (!this.token) {
            this.router.navigate(['/login']);
      return false;
    } else {      
                return true;
      
    }
  }
}


