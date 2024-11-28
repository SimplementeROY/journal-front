import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsideComponent } from "../../components/aside/aside.component";
import { NoticiasService } from '../../services/noticias.service';
import { INoticia } from '../../interfaces/inoticia.interface';
import { NoticiaCardComponent } from "../../components/noticia-card/noticia-card.component";
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-page-busqueda',
  standalone: true,
  imports: [AsideComponent, NoticiaCardComponent],
  templateUrl: './page-busqueda.component.html',
  styleUrl: './page-busqueda.component.css'
})
export class PageBusquedaComponent {
  query: string = '';
  activatedRoute = inject(ActivatedRoute)
  noticiasService = inject(NoticiasService)
  arrNoticiasBuscadas: INoticia[] = [];
  prev: string = '';
  next: string = '';
  viewportScroller = inject(ViewportScroller)
  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(async (params: any) => {
      this.query = params.q
      let parsedQuery: string = this.query.replace(' ', '&')
      try {
        let respuesta: any = await this.noticiasService.getByName(parsedQuery, 10)

        this.arrNoticiasBuscadas = respuesta.resultado
        this.prev = respuesta.prev;
        this.next = respuesta.next;
      } catch (error) {
        this.arrNoticiasBuscadas = []
      }

    })
  }

  async nextNews() {
    if (!this.next) {
      return
    }
    this.chargeData(this.next)
  }

  async prevNews() {
    if (!this.prev) {
      return
    }
    this.chargeData(this.prev)
  }
  async chargeData(url: string) {
    try {
      let respuesta: any = await this.noticiasService.getByUrl(url);
      this.viewportScroller.scrollToPosition([0, 0]);
      this.arrNoticiasBuscadas = respuesta.resultado
      this.prev = respuesta.prev;
      this.next = respuesta.next;
    } catch (error) {
      console.log(error);
    }

  }
}

