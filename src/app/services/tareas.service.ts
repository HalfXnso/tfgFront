import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea } from '../interfaces/tarea';
@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private readonly url: string = `${environment.BACK_URL}/tareas`;

  constructor(private http: HttpClient) { }

  getTareas(): Observable<any[]> {
    console.log(this.url);
    return this.http.get<any[]>(this.url);

  }
  getTareaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  crearTarea(tarea: Tarea): Observable<any> {
    return this.http.post<any>(this.url, tarea);
  }

  updateTarea(id: number, tarea: any): Observable<any> {
    return this.http.patch<any>(`${this.url}/${id}`, tarea);
  }


  deleteTarea(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
