import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ICategoria } from '../../interfaces/icategoria.interface';
import { CategoriasService } from '../../services/categorias.service';
import { suscriptoresService } from './../../services/suscriptores.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-formulario-suscripcion',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-suscripcion.component.html',
  styleUrl: './formulario-suscripcion.component.css'
})
export class FormularioSuscripcionComponent {
  @Input() colocacion: string = "";
  miFormulario: FormGroup;
  arrCategorias: ICategoria[] = [];
  categoriasService = inject(CategoriasService);
  suscriptoresService = inject(suscriptoresService);

  constructor() {
    this.miFormulario = new FormGroup({

      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        // Validators.email
      ]),
      categorias: new FormControl([], [this.categoriaValidador()])

    }, [])
  }

  async ngOnInit() {
    this.arrCategorias = await this.categoriasService.getAll()
  }

  /*
  TODO pese a que ya funciona todo bien hay un error: al solicitar la suscripción SE CREA EL SUSCRIPTOR, luego le llega el mail con la
  confirmación, si no confirma no se habrá finalizado el alta y no le llegarán noticias PERO el suscriptor SE HA CREADO en la base de datos,
  si trata de volver a darse de alta porque a eliminado el mail de confirmación le saltará un error de que YA EXISTE EL SUSCRIPTOR y no podrá volver a darse de alta.
  Ver cómo solucionarlo.
  */

  async getDataForm() {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
    }
    if (this.miFormulario.valid) {
      try {
        const existeEmail = await this.suscriptoresService.getExisteEmailSuscriptor(this.miFormulario.value.email);
        if (existeEmail != false) {//si el email existe la funcion devuelve el objeto suscriptor, sino devuelve false

          Swal.fire({
            icon: "warning",
            title: "¡Email duplicado!",
            text: "El email " + this.miFormulario.value.email + " ya existe en nuestra la base de datos de suscriptores.",
            footer: '<p>Si perdiste el email de confirmación date de baja aquí</p><p><a href="/baja_suscriptor">Baja suscripción</a></p>'
          });

          this.miFormulario.reset();
        } else {
          const respuesta = await this.suscriptoresService.postCrearSuscriptor(this.miFormulario.value);

          const Toast = Swal.mixin({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: respuesta.mensaje
          });

          this.miFormulario.reset();
        }
      } catch (error: any) {
        console.log(error.error.message);
      }
    }
  }

  toggleCategoria(index: number) {
    const categoriasSeleccionadas: number[] = this.miFormulario.get('categorias')?.value || [];
    const categoriaId = this.arrCategorias[index].id;

    if (categoriasSeleccionadas.includes(categoriaId)) {
      // Si ya está seleccionado, lo quitamos
      const nuevoArray = categoriasSeleccionadas.filter(id => id !== categoriaId);
      this.miFormulario.get('categorias')?.setValue(nuevoArray);
    } else {
      // Si no está seleccionado, lo agregamos
      this.miFormulario.get('categorias')?.setValue([...categoriasSeleccionadas, categoriaId]);
      this.miFormulario.get('categorias')?.markAsTouched();
      this.miFormulario.get('categorias')?.updateValueAndValidity();
    }
  }

  categoriaValidador(): ValidatorFn {
    return (control) => {
      const categoriasSeleccionadas = control.value;
      return categoriasSeleccionadas && categoriasSeleccionadas.length > 0
        ? null
        : { sinCategoriaSeleccionada: true }; // Devuelve error si no hay categorías seleccionadas
    };
  }

  checkControl(formControlName: string, validator: string) {
    // return this.miFormulario.get(formControlName)?.touched;
    return this.miFormulario.get(formControlName)?.hasError(validator) && this.miFormulario.get(formControlName)?.touched;
  }
}
