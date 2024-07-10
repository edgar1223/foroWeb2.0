import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AnalysisResult } from '../../models/analysis-result';

@Injectable({
  providedIn: 'root'
})
export class IaService {
  private apiUrl = environment.apiUrl;
  private readonly USER_TYPE_KEY = 'userType';

  constructor(private http: HttpClient) { }

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  analisisPost():Observable<AnalysisResult>{
    const token=this.getToken();
    return this.http.get<AnalysisResult>(`${this.apiUrl}/analisis/analyze-posts?toke=${token}`)
  }
  comportamiento():Observable<any>{
    const token=this.getToken();
    return this.http.get<any>(`${this.apiUrl}/analisis/tendencias?toke=${token}`)
  }
}
