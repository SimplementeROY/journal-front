import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICategoria } from '../interfaces/icategoria.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  // private endpoint = 'https://upgrade-news.onrender.com/api/categorias/';
  private endpoint = 'http://localhost:3000/api/categorias/';
  private httpClient = inject(HttpClient)

  getAll(): Promise<ICategoria[]> {
    return firstValueFrom(this.httpClient.get<ICategoria[]>(this.endpoint))
  }

  getById(id: number | undefined): Promise<ICategoria> {
    return firstValueFrom(this.httpClient.get<ICategoria>(`${this.endpoint}/${id}`))
  }
}
