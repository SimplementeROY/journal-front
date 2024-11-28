import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NoticiasService } from '../../../services/noticias.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { CategoriasService } from '../../../services/categorias.service';
import { inject } from '@angular/core';
import { ICategoria } from '../../../interfaces/icategoria.interface';
import { IUsuario } from '../../../interfaces/iusuario.interface';
import { INoticia } from '../../../interfaces/inoticia.interface';
import { Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EditorComponent } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-page-edicion',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, EditorComponent],
  templateUrl: './page-edicion.component.html',
  styleUrls: ['./page-edicion.component.css']
})
export class PageEdicionComponent {

  categoriasService = inject(CategoriasService);
  usuariosService = inject(UsuariosService);
  noticiasService = inject(NoticiasService);

  editarNoticiaForm: FormGroup;
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  arrCategorias: ICategoria[] = [];
  arrEditores: IUsuario[] = [];

  init: EditorComponent['init'] = {
    base_url: '/tinymce',
    suffix: '.min',

  }

  noticia!: INoticia;
  noticiaId!: any;
  //  Defino noticiaId aqui para poder usarlo en la función obtenerNoticia y en la función de editar la noticia

  // Rol del usuario en obtener el id del usuario obtengo el rol y lo guardo en esta variable
  rolUsuario!: string;
  usuarioId!: IUsuario;
  showToast: boolean = false;
  publicable: boolean = false;

  // Inyectar el servicio de toastr para mostrar mensajes de éxito o error
  constructor(private toastr: ToastrService) {
    this.editarNoticiaForm = new FormGroup({
      titular: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      texto: new FormControl('', [
        Validators.required,
        Validators.maxLength(4294967295)
      ]),
      importancia: new FormControl(null, [
        Validators.required
      ]),
      categoria_id: new FormControl("", [
        Validators.required
      ]),
      imagen: new FormControl(null, [
        Validators.required
      ]),
      slug: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      ]),
      estado: new FormControl('', [
        Validators.required
      ]),
      secciones: new FormControl(null, [
        Validators.required
      ]),
      editor_id: new FormControl("", [
        Validators.required
      ]),
      fecha_publicacion: new FormControl(new Date().toISOString().split('T')[0], [
        Validators.required
      ]),
      redactor_id: new FormControl("", []),
      cambios: new FormControl(null, [])
    });

    this.editarNoticiaForm.get('titular')?.valueChanges.subscribe(value => {
      const slug = this.generateSlug(value);
      this.editarNoticiaForm.patchValue({
        slug: slug
      });
    });
  }

  ngOnInit() {

    this.obtenerNoticia();

    // Para obtener las categorias
    this.categoriasService.getAll().then((data: ICategoria[]) => {
      this.arrCategorias = data;
    });

    // Para obtener los editores
    this.usuariosService.getEditores().then((data: IUsuario[]) => {
      this.arrEditores = data;
    });

    // Para obtener el id del usuario y bloquear acceso al cambio del estado
    this.usuariosService.getUsuarioPorId().then((data: IUsuario) => {
      this.usuarioId = data;
      this.rolUsuario = this.usuarioId.rol;
      this.publicable = this.rolUsuario === 'editor'
      console.log(this.publicable);

    });

  }

  obtenerNoticia() {
    this.activatedRoute.params.subscribe(async params => {
      this.noticiaId = params['noticiaId'];
      try {
        const noticia = await this.noticiasService.getById(this.noticiaId);
        this.editarNoticiaForm.setValue({
          titular: noticia.titular,
          texto: noticia.texto,
          importancia: noticia.importancia,
          slug: noticia.slug,
          estado: noticia.estado,
          fecha_publicacion: noticia.fecha_publicacion,
          secciones: noticia.secciones,
          imagen: noticia.imagen,
          editor_id: noticia.editor_id,
          categoria_id: noticia.categoria_id,
          redactor_id: noticia.redactor_id,
          cambios: noticia.cambios
        });

      } catch (error) {
        console.error('Error al obtener la noticia:', error);
      }
    });
  }

  generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  async onSubmit() {
    if (this.editarNoticiaForm.valid) {
      try {
        await this.noticiasService.updateNoticia(this.editarNoticiaForm.value, this.noticiaId);
        // Muestra un mensaje de éxito
        this.toastr.success('¡Noticia actualizada correctamente!', 'Éxito');
        // Redirecciona a la página de noticias después de 1 segundo
        setTimeout(() => {
          this.router.navigate(['/dashboard', 'noticias']);
        }, 1000);
      } catch (error) {
        // Muestra un mensaje de error
        this.toastr.error('Error al actualizar la noticia', 'Error');
      }
    }
  }
}