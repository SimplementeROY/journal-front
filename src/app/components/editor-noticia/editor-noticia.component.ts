import { Component } from '@angular/core';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-editor-noticia',
  standalone: true,
  imports: [EditorComponent],
  templateUrl: './editor-noticia.component.html',
  styleUrl: './editor-noticia.component.css',
  providers: [{ provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }]
})
export class EditorNoticiaComponent {
  init: EditorComponent['init'] = {
    base_url: '/tinymce',
    suffix: '.min'
  }
}
