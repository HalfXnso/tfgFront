import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../interfaces/evento';

@Injectable({
  providedIn: 'root'
})


export class EventosService {
  // http://localhost:3000/eventos
  private readonly url: string = `${environment.BACK_URL}/eventos`;

  constructor(private http: HttpClient) { }

  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }
  getEventoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  crearEvento(evento: Evento): Observable<any> {
    return this.http.post<any>(this.url, evento);
  }

  updateEvento(id: number, evento: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${evento.id}`, evento);
  }

  getEventosPorRango(fechaInicio: string, fechaFin: string): Observable<any[]> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);

    return this.http.get<any[]>(`${this.url}/rango-fechas`, { params });
  }

  deleteEvento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

asistenteDialogflow(texto: string): Observable<any> {
  const payload = {
    queryResult: {
      queryText: texto
    }
  };

  return this.http.post<any>(`${this.url}/asistente/dialogflow`, payload);
}

}
