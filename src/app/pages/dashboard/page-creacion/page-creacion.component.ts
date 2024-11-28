import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { INoticia } from '../../../interfaces/inoticia.interface';
import { ICategoria } from '../../../interfaces/icategoria.interface';
import { CategoriasService } from '../../../services/categorias.service';
import { NoticiasService } from '../../../services/noticias.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { IUsuario } from '../../../interfaces/iusuario.interface';
import { Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EditorComponent } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-page-creacion',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, EditorComponent],
  templateUrl: './page-creacion.component.html',
  styleUrl: './page-creacion.component.css'
})

export class PageCreacionComponent {

  arrCategorias: ICategoria[] = []
  crearNoticiaForm: FormGroup

  categoriasService = inject(CategoriasService)
  noticiasService = inject(NoticiasService)
  usuariosService = inject(UsuariosService)
  router = inject(Router)

  noticia!: INoticia
  usuarioId!: IUsuario
  rolUsuario!: string
  arrEditores: IUsuario[] = []

  init: EditorComponent['init'] = {
    base_url: '/tinymce',
    suffix: '.min',

  }
  constructor(private toastr: ToastrService) {
    this.crearNoticiaForm = new FormGroup({
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
      estado: new FormControl('borrador', [
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

    // Para generar el slug en tiempo real con el input del titular
    this.crearNoticiaForm.get('titular')?.valueChanges.subscribe(value => {
      const slug = this.generarSlug(value);
      this.crearNoticiaForm.patchValue({
        slug: slug
      });
    });

  }

  ngOnInit(): void {
    // Para obtener las categorias
    this.categoriasService.getAll().then((data: ICategoria[]) => {
      this.arrCategorias = data;
      (this.arrCategorias);
    });

    // Para obtener los editores
    this.usuariosService.getEditores().then((data: IUsuario[]) => {
      this.arrEditores = data;
      (this.arrEditores);
    });

    // Para obtener el id del usuario y bloquear acceso al cambio del estado
    this.usuariosService.getUsuarioPorId().then((data: IUsuario) => {
      this.usuarioId = data;
      (this.usuarioId);
      this.crearNoticiaForm.patchValue({
        redactor_id: this.usuarioId.id
      });
      this.rolUsuario = this.usuarioId.rol;
    });
  }

  // Función para enviar el formulario
  async onSubmit() {
    if (this.crearNoticiaForm.invalid) {
      this.toastr.error('No pueden haber campos en blanco', 'Error');
      return;
    }
    console.table(this.crearNoticiaForm.value);
    this.noticiasService.insertNoticia(this.crearNoticiaForm.value).then((data: INoticia[]) => {
      console.table(data);
    });
    this.toastr.success('¡Noticia creada correctamente!', 'Éxito');
    setTimeout(() => {
      this.router.navigate(['/dashboard', 'noticias']);
    }, 1000);
  }

  // Función para generar el slug
  generarSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }

}