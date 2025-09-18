import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterResponse } from '../../../core/models/auth.models';
import { AuthService } from '../../../core/services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register.component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  form: FormGroup | any;
  response: RegisterResponse | any;
  errorMessage : string = ''

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


  onSubmit() {
    if (!this.form || this.form.invalid) return;

    this.authService.register(this.form.value).subscribe({
      next: (res) => {
        // Guardar token en cookie de manera segura
        document.cookie = `jwt=${res.token};path=/;secure;samesite=strict`;

        // Redirigir al home
        this.router.navigate(['/']);
      },
      error: (err) => {
        // Resetea cualquier mensaje previo
        this.errorMessage = '';

        // Manejo de errores específicos de la API
        if (err.status === 400 && err.error) {
          // Si la API devuelve errores de validación como objeto
          if (err.error.errors) {
            const apiErrors = err.error.errors;
            // Convertimos los errores a un string simple o lo mostramos en el formulario
            this.errorMessage = Object.values(apiErrors)
                                      .flat()
                                      .join(' | ');
          } else if (err.error.message) {
            this.errorMessage = err.error.message;
          }
        } else if (err.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor';
        } else {
          this.errorMessage = 'Ha ocurrido un error inesperado';
        }

        console.error('Error registro:', err);
      }
    });
  }


}
