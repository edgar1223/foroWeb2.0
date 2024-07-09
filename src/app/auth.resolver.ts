
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthResolver implements Resolve<boolean> {

  constructor(private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No token, redirecting to /login');
        this.router.navigate(['/login']);
        return false;
      } else {
        console.log('Token found, allowing access');
        return true;
      }
    } else {
      console.log('localStorage not available, redirecting to /login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
