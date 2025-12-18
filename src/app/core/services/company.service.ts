import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Enterprise } from '../models';

export interface CompanyWithStudents extends Enterprise {
  studentCount: number;
  internshipTypes: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/companies`;

  /**
   * Obtener todas las empresas donde el tutor supervisa estudiantes
   */
  getMyCompanies(): Observable<CompanyWithStudents[]> {
    return this.http.get<CompanyWithStudents[]>(`${this.apiUrl}/my-companies`);
  }

  /**
   * Obtener una empresa específica con detalles
   */
  getCompanyById(companyId: number): Observable<CompanyWithStudents> {
    return this.http.get<CompanyWithStudents>(`${this.apiUrl}/${companyId}`);
  }

  /**
   * Obtener estudiantes de una empresa específica
   */
  getCompanyStudents(companyId: number, filters?: any): Observable<any[]> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<any[]>(
      `${this.apiUrl}/${companyId}/students`,
      { params }
    );
  }

  /**
   * Obtener evaluaciones de una empresa específica
   */
  getCompanyEvaluations(companyId: number, filters?: any): Observable<any[]> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<any[]>(
      `${this.apiUrl}/${companyId}/evaluations`,
      { params }
    );
  }

  /**
   * Obtener estadísticas de una empresa
   */
  getCompanyStatistics(companyId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${companyId}/statistics`);
  }

  /**
   * Generar reporte de una empresa
   */
  generateCompanyReport(companyId: number, params: any): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/${companyId}/report`,
      params,
      { responseType: 'blob' }
    );
  }
}