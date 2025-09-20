import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {
  clienteForm: FormGroup;
  isEditMode = false;
  clienteId: number | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  generos = [
    { value: 1, label: 'Masculino' },
    { value: 2, label: 'Femenino' }
  ];

  tiposIdentificacion = [
    { value: 'Cedula', label: 'Cédula' },
    { value: 'Pasaporte', label: 'Pasaporte' },
    { value: 'RUC', label: 'RUC' }
  ];

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.clienteForm = this.fb.group({
      clienteId: ['', [Validators.required, Validators.pattern(/^CLI\d{3}$/)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      genero: [1, Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      numeroIdentificacion: ['', [Validators.required, Validators.pattern(/^\d{10,13}$/)]],
      tipoIdentificacion: ['Cedula', Validators.required],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      contrasena: ['', [Validators.required, Validators.minLength(4)]],
      estado: [true]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.clienteId = +params['id'];
        this.loadCliente(this.clienteId);
      }
    });
  }

  loadCliente(id: number): void {
    this.loading = true;
    this.clienteService.getById(id).subscribe({
      next: (cliente) => {
        this.clienteForm.patchValue(cliente);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      this.loading = true;
      const cliente: Cliente = this.clienteForm.value;

      const operation = this.isEditMode
        ? this.clienteService.update(this.clienteId!, cliente)
        : this.clienteService.create(cliente);

      operation.subscribe({
        next: () => {
          this.successMessage = this.isEditMode ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/clientes']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/clientes']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.clienteForm.controls).forEach(key => {
      const control = this.clienteForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.clienteForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      switch (fieldName) {
        case 'clienteId':
          return 'Formato: CLI001';
        case 'numeroIdentificacion':
          return 'Solo números, 10-13 dígitos';
        case 'telefono':
          return '10 dígitos';
        default:
          return 'Formato inválido';
      }
    }
    if (control?.hasError('min')) {
      return `Valor mínimo: ${control.errors?.['min'].min}`;
    }
    if (control?.hasError('max')) {
      return `Valor máximo: ${control.errors?.['max'].max}`;
    }
    return '';
  }
}