import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Departamentos } from '../models/Departamentos/departamentos';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const loginData = { 
      "email":email,
       "password":password };
    return this.http.post<any>("http://localhost:8080/api/usuarios/login", loginData)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage =  error.error.message;
        console.log(errorMessage); // Log the specific error message
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  RegistroAlumno(control:number,nombre:string,apellido:string,email: string,semestre:number, password: string
    ,deparamentos:number
  ): Observable<any> {
    const RegistroData = { 
      "id": control,
      "nombre": nombre,
      "apellido": apellido,
      "email": email,
      "password": password,
      "semestre":semestre,
      "departamento_id":deparamentos 
      };
    return this.http.post<any>("http://localhost:8080/api/usuarios/alumno", RegistroData)
      .pipe(
        catchError(this.handleError)
      );
  }
  getAlldepartamentos():Observable<Departamentos[]>{
    return this.http.get<Departamentos[]>("http://localhost:8080/api/deparamentos/institucion/1");
  }
}
