import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class suscriptoresService {
  // private endpoint = 'https://upgrade-news.onrender.com/api/suscriptores/';
  private endpoint = 'http://localhost:3000/api/suscriptores/';
  private httpClient = inject(HttpClient)

  postCrearSuscriptor(nuevoSuscriptor: any) {
    return firstValueFrom(this.httpClient.post<any>(this.endpoint, nuevoSuscriptor));
  }

  getActivarSuscriptor(id: number, activo: number, token: string): Promise<any> {
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "authSuscriptor": token
    });
    return firstValueFrom(this.httpClient.get<any>(`${this.endpoint}/activar/${id}/${activo}`, { headers }))
  }

  getExisteEmailSuscriptor(email: string) {
    const existeEmail = firstValueFrom(this.httpClient.get<any>(`${this.endpoint}/email/${email}`));
    return existeEmail
  }

  solicitarBajaSuscriptor(email: string) {//solamente hace que se reciva un email con el enlace a la baja realmente, el email contendrá un token de auth
    const bajaSuscriptor = firstValueFrom(this.httpClient.get<any>(`${this.endpoint}/baja/${email}`));
    return bajaSuscriptor;
  }

  deleteSuscriptor(email: string, token: string) {
    const ruta = `${this.endpoint}/email/${email}`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "authSuscriptor": token
    });
    const bajaSuscriptor = firstValueFrom(this.httpClient.delete<any>(ruta, { headers }));
    return bajaSuscriptor;
  }
}