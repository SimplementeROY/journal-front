import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { INoticia } from '../interfaces/inoticia.interface';

type Respuesta = {
  resultado: INoticia[];
  prev: string | null;
  next: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  private endpoint = 'https://journal-back.onrender.com/api/noticias/';
  // private endpoint = 'http://localhost:3000/api/noticias/';

  private httpClient = inject(HttpClient)

  getAll(seccion: string, categoria: string = '', limit: number): Promise<INoticia[]> {
    if (categoria !== 'home') {
      return firstValueFrom(this.httpClient.get<INoticia[]>(`${this.endpoint}?seccion=${seccion}&categoria=${categoria}&num=${limit}`))
    }
    return firstValueFrom(this.httpClient.get<INoticia[]>(`${this.endpoint}?seccion=${seccion}&num=${limit}`))
  }

  getById(id: number): Promise<INoticia> {
    return firstValueFrom(this.httpClient.get<INoticia>(`${this.endpoint}/${id}`))
  }

  getByUser(): Promise<Respuesta> {
    return firstValueFrom(this.httpClient.get<Respuesta>(`${this.endpoint}/usuario/`))
  }

  getBySlug(slug: string): Promise<INoticia> {
    return firstValueFrom(this.httpClient.get<INoticia>(`${this.endpoint}/?slug=${slug}`))
  }

  getUltimasNoticias(limit: number): Promise<INoticia[]> {
    return firstValueFrom(this.httpClient.get<INoticia[]>(`${this.endpoint}/ultimas/?num=${limit}`))
  }

  // Crear una noticia
  insertNoticia(noticia: INoticia): Promise<INoticia[]> {
    return firstValueFrom(this.httpClient.post<INoticia[]>(`${this.endpoint}`, noticia))
  }

  // Editar una noticia
  updateNoticia(noticia: INoticia, id: number): Promise<INoticia> {
    return firstValueFrom(this.httpClient.put<INoticia>(`${this.endpoint}/${id}`, noticia))
  }

  getByName(texto: string, limit: number, url: string = ''): Promise<Respuesta> {
    if (url) {
      return firstValueFrom(this.httpClient.get<Respuesta>(`${url}?num=${limit}`))
    }
    return firstValueFrom(this.httpClient.get<Respuesta>(`${this.endpoint}/busqueda/${texto}?num=${limit}`))
  }

  getByUrl(url: string): Promise<Respuesta> {

    return firstValueFrom(this.httpClient.get<Respuesta>(`${url}`))
  }
}
