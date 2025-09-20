import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuentaService } from '../../../core/services/cuenta.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cuenta } from '../../../core/models/cuenta.model';
import { Cliente } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-cuenta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cuenta-form.component.html',
  styleUrls: ['./cuenta-form.component.css']
})
export class CuentaFormComponent implements OnInit {
  cuentaForm: FormGroup;
  isEditMode = false;
  cuentaId: number | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';
  clientes: Cliente[] = [];

  tiposCuenta = [
    { value: 1, label: 'Ahorro' },
    { value: 2, label: 'Corriente' }
  ];

  constructor(
    private fb: FormBuilder,
    private cuentaService: CuentaService,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.cuentaForm = this.fb.group({
      numeroCuenta: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      tipoCuenta: [1, Validators.required],
      saldoInicial: ['', [Validators.required, Validators.min(0)]],
      clienteId: ['', Validators.required],
      estado: [true]
    });
  }

  ngOnInit(): void {
    this.loadClientes();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.cuentaId = +params['id'];
        this.loadCuenta(this.cuentaId);
      }
    });
  }

  loadClientes(): void {
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar clientes';
      }
    });
  }

  loadCuenta(id: number): void {
    this.loading = true;
    this.cuentaService.getById(id).subscribe({
      next: (cuenta) => {
        this.cuentaForm.patchValue(cuenta);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.cuentaForm.valid) {
      this.loading = true;
      const cuenta: Cuenta = this.cuentaForm.value;

      const operation = this.isEditMode
        ? this.cuentaService.update(this.cuentaId!, cuenta)
        : this.cuentaService.create(cuenta);

      operation.subscribe({
        next: () => {
          this.successMessage = this.isEditMode ? 'Cuenta actualizada exitosamente' : 'Cuenta creada exitosamente';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/cuentas']);
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
    this.router.navigate(['/cuentas']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.cuentaForm.controls).forEach(key => {
      const control = this.cuentaForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.cuentaForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('pattern')) {
      switch (fieldName) {
        case 'numeroCuenta':
          return 'Debe ser 6 dígitos';
        default:
          return 'Formato inválido';
      }
    }
    if (control?.hasError('min')) {
      return `Valor mínimo: ${control.errors?.['min'].min}`;
    }
    return '';
  }
}