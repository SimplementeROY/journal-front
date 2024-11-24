import { Component, inject, Input } from '@angular/core';
import { INoticia } from '../../interfaces/inoticia.interface';
import { NoticiasService } from '../../services/noticias.service';
import { AsideComponent } from '../../components/aside/aside.component';
import { DomSanitizer } from '@angular/platform-browser';
import { TraducirHtmlPipe } from '../../pipes/traducir-html.pipe';

@Component({
  selector: 'app-page-vista-noticia',
  standalone: true,
  imports: [AsideComponent, TraducirHtmlPipe],
  templateUrl: './page-vista-noticia.component.html',
  styleUrl: './page-vista-noticia.component.css'
})

export class PageVistaNoticiaComponent {

  @Input() miNoticia?: INoticia;
  @Input() noticiaSlug: string = '';

  noticiasService = inject(NoticiasService)

  async ngOnChanges() {
    this.miNoticia = await this.noticiasService.getBySlug(this.noticiaSlug)

  }

  goBack() {
    window.history.back();
  }

}
