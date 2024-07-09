import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  isTokenValid(): boolean {
    const token = localStorage.getItem('authToken');
    // Lógica para verificar si el token es válido
    // Esto podría involucrar una llamada a una API para verificar el token en el servidor
    return token !== null && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    // Lógica para verificar si el token ha expirado
    // Por ejemplo, decodificar el token JWT y verificar la fecha de expiración
    return false; // Implementar la lógica según tu caso
  }
}
