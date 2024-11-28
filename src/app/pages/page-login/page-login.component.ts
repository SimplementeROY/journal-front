import { Component, inject, } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './page-login.component.html',
  styleUrl: './page-login.component.css'
})

export class PageLoginComponent {

  loginForm: FormGroup;
  usersService = inject(UsuariosService)
  router = inject(Router)

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      contraseña: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern('^1234$')])
    }, [])
  }

  async getDataLogin() {
    try {
      (this.loginForm.value);

      let response: any = await this.usersService.login(this.loginForm.value)
      localStorage.setItem('token', response.token);
      Swal.fire({
        icon: 'success',
        title: '¡Inicio de sesión exitoso!',
        text: '¡Te has conectado correctamente!',
        confirmButtonText: 'Aceptar',
        background: '#f0f8ff',
        color: '#333',
        iconColor: '#28a745',
      });
      this.router.navigate(['/dashboard'])

    } catch (error: any) {
      (error.error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error en el inicio de sesión',
        text: 'Correo electrónico o contraseña incorrectos. Por favor, inténtalo de nuevo.',
        confirmButtonText: 'Reintentar',
        background: '#ffe6e6',
        color: '#333',
        iconColor: '#dc3545',
      });
    }
  }
}
