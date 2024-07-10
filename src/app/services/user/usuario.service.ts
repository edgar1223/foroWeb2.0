import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/usuario/user';
import {Post} from '../../models/post'
import { MateriaRecurentes } from '../../models/usuario/materia-recurentes';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
 

  private apiUrl = 'http://localhost:8080/api/usuarios';
  private readonly USER_TYPE_KEY = 'userType';

  constructor(private http: HttpClient) { }

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  UsuarioByID(): Observable<User> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User>(`${this.apiUrl}/token?token=${token}`);
  }
  PostByUsuariId():Observable<Post[]>{
    const token = this.getToken();
    return this.http.get<Post[]>(`http://localhost:8080/api/post/usuarioPost?token=${token}`);
  }
  MaterRecurrentes():Observable<MateriaRecurentes[]>{
    const token = this.getToken();
    return this.http.get<MateriaRecurentes[]>(`http://localhost:8080/api/post/usuarioMaterias?token=${token}`);
  }

  updateUser(usuario: any, img: File | null) {
    const formData: FormData = new FormData();
    formData.append('usuario', JSON.stringify(usuario));
    if (img) {
      formData.append('img', img, img.name);
    }
    const token = this.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/update`, formData, { headers });
  }
  // Método para codificar en Base64
  private encode(value: string): string {
    return btoa(value);
  }

  // Método para decodificar de Base64
  private decode(value: string): string {
    return atob(value);
  }
   // Guardar el tipo de usuario en localStorage con codificación
   setUserType(userType: string): void {
    const encodedUserType = this.encode(userType);
    localStorage.setItem(this.USER_TYPE_KEY, encodedUserType);
  }

  // Obtener el tipo de usuario de localStorage y decodificarlo
  getUserType(): string | null {
    const encodedUserType = localStorage.getItem(this.USER_TYPE_KEY);
    return encodedUserType ? this.decode(encodedUserType) : null;
  }

  // Limpiar el tipo de usuario de localStorage
  clearUserType(): void {
    localStorage.removeItem(this.USER_TYPE_KEY);
  }

  findAllProofesores() :Observable<User[]>{
    const token = this.getToken();
    return this.http.get<User[]>(`${this.apiUrl}/Profesor/1?token=${token}`);
  }
  setProfesor(id: number, nombre: string, apellido: string, email: string, lista: number[], password: string,
     departamento: number) :Observable<any> {
      const RegistroData = { 
        "id": id,
        "nombre": nombre,
        "apellido": apellido,
        "email": email,
        "password": password,
        "materiaIds":lista,
        "departamentoId":departamento 
        };
        const token = this.getToken();
        return this.http.post<any>(`${this.apiUrl}/profesor?token=${token}`, RegistroData);
  }

} 

