import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IStudent } from '../../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  /**
   * Diákok API base url-je
   */
  private readonly studentBaseUrl = `${environment.apiUrl}/students`;

  /**
   * HttpClient injektálása
   */
  private readonly httpClient = inject(HttpClient);

  /**
   * Diákok lekérdezése
   *
   * @returns {Observable<IStudent[]>}
   */
  public getAllStudents(limit: number, offset: number): Observable<IStudent[]> {
    const params = new HttpParams().appendAll({ limit, offset });
    return this.httpClient.get<IStudent[]>(`${this.studentBaseUrl}/list`, {
      params,
    });
  }

  /**
   * Új diák objektum létrehozása
   *
   * @param {string} name diák teljes neve
   * @param {string} email diák e-mail címe
   * @returns {Observable<IStudent>} Az új létrehozott diák objektuma
   */
  public createStudent(name: string, email: string): Observable<IStudent> {
    return this.httpClient.post<IStudent>(`${this.studentBaseUrl}/create`, {
      name,
      email,
    });
  }

  /**
   * Diák módosítása paraméterben megadott diák objektum alapján
   *
   * @param {IStudent} student új diák objektum adatai
   * @returns {Observable<IStudent>} Módosított diák objektum
   */
  public updateStudent(student: IStudent): Observable<IStudent> {
    return this.httpClient.put<IStudent>(
      `${this.studentBaseUrl}/update`,
      student,
    );
  }

  /**
   * Diák objektum eltávolítása paraméterben megadott azonosító alapján
   *
   * @param {string} studentId diák azonosítója
   * @returns {Observable<string>} Az eltávolított diák azonosítója
   */
  public deleteStudent(studentId: string): Observable<string> {
    return this.httpClient.delete<string>(
      `${this.studentBaseUrl}/delete/${studentId}`,
      { responseType: 'text' as 'json' },
    );
  }
}
