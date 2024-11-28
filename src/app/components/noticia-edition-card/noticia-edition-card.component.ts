import { Component, Input, inject } from '@angular/core';
import { INoticia } from '../../interfaces/inoticia.interface';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { RecortarTextoPipe } from '../../pipes/recortar-texto.pipe';
import { ToastrService } from 'ngx-toastr';
import { UsuariosService } from '../../services/usuarios.service';
import { TraducirHtmlPipe } from '../../pipes/traducir-html.pipe';


@Component({
  selector: 'app-noticia-edition-card',
  standalone: true,
  imports: [RouterLink, UpperCasePipe, RecortarTextoPipe, TraducirHtmlPipe],
  templateUrl: './noticia-edition-card.component.html',
  styleUrl: './noticia-edition-card.component.css'
})

export class NoticiaEditionCardComponent {
  @Input() miNoticia?: INoticia | any;

  private toastr = inject(ToastrService);
  private usuariosService = inject(UsuariosService);
  rolUsuario: string = '';

  ngOnInit() {
    this.cargarRolUsuario();
  }

  async cargarRolUsuario() {
    const usuario = await this.usuariosService.getUsuarioPorId();
    this.rolUsuario = usuario.rol;
  }

  intentarEditar(): void {
    if (this.rolUsuario === 'redactor' && this.miNoticia?.estado === 'publicado') {
      this.toastr.error('Acceso no autorizado (Solo editores)');
      return;
    }
    // Si no es redactor o la noticia no está publicada, permite la navegación
  }
}