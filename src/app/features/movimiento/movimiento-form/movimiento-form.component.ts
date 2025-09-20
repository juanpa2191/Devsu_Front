import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovimientoService } from '../../../core/services/movimiento.service';
import { CuentaService } from '../../../core/services/cuenta.service';
import { Movimiento } from '../../../core/models/movimiento.model';
import { Cuenta } from '../../../core/models/cuenta.model';

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movimiento-form.component.html',
  styleUrls: ['./movimiento-form.component.css']
})
export class MovimientoFormComponent implements OnInit {
  movimientoForm: FormGroup;
  isEditMode = false;
  movimientoId: number | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';
  cuentas: Cuenta[] = [];
  saldoDisponible = 0;

  tiposMovimiento = [
    { value: 1, label: 'Depósito' },
    { value: 2, label: 'Retiro' }
  ];

  LIMITE_DIARIO = 1000;

  constructor(
    private fb: FormBuilder,
    private movimientoService: MovimientoService,
    private cuentaService: CuentaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.movimientoForm = this.fb.group({
      tipoMovimiento: [1, Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      cuentaId: ['', Validators.required]
    });

    // Escuchar cambios en cuenta para mostrar saldo
    this.movimientoForm.get('cuentaId')?.valueChanges.subscribe(cuentaId => {
      this.updateSaldoDisponible(cuentaId);
    });
  }

  ngOnInit(): void {
    this.loadCuentas();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.movimientoId = +params['id'];
        this.loadMovimiento(this.movimientoId);
      }
    });
  }

  loadCuentas(): void {
    this.cuentaService.getAll().subscribe({
      next: (data) => {
        this.cuentas = data.filter(cuenta => cuenta.estado); // Solo cuentas activas
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar cuentas';
      }
    });
  }

  loadMovimiento(id: number): void {
    this.loading = true;
    this.movimientoService.getById(id).subscribe({
      next: (movimiento) => {
        this.movimientoForm.patchValue(movimiento);
        this.updateSaldoDisponible(movimiento.cuentaId);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }

  updateSaldoDisponible(cuentaId: number): void {
    const cuenta = this.cuentas.find(c => c.id === cuentaId);
    this.saldoDisponible = cuenta ? cuenta.saldoInicial : 0;
  }

  onSubmit(): void {
    if (this.movimientoForm.valid) {
      const movimiento: Movimiento = {
        ...this.movimientoForm.value,
        fecha: new Date().toISOString(),
        saldo: this.calcularNuevoSaldo()
      };

      // Validaciones de negocio
      if (!this.validarMovimiento(movimiento)) {
        return;
      }

      this.loading = true;
      const operation = this.isEditMode
        ? this.movimientoService.update(this.movimientoId!, movimiento)
        : this.movimientoService.create(movimiento);

      operation.subscribe({
        next: () => {
          this.successMessage = this.isEditMode ? 'Movimiento actualizado exitosamente' : 'Movimiento creado exitosamente';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/movimientos']);
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

  calcularNuevoSaldo(): number {
    const tipo = this.movimientoForm.get('tipoMovimiento')?.value;
    const valor = this.movimientoForm.get('valor')?.value;

    if (tipo === 1) { // Depósito
      return this.saldoDisponible + valor;
    } else { // Retiro
      return this.saldoDisponible - valor;
    }
  }

  validarMovimiento(movimiento: Movimiento): boolean {
    if (movimiento.tipoMovimiento === 2) { // Retiro
      if (movimiento.valor > this.saldoDisponible) {
        this.errorMessage = 'Saldo no disponible';
        return false;
      }

      if (movimiento.valor > this.LIMITE_DIARIO) {
        this.errorMessage = 'Cupo diario excedido';
        return false;
      }
    }

    return true;
  }

  onCancel(): void {
    this.router.navigate(['/movimientos']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.movimientoForm.controls).forEach(key => {
      const control = this.movimientoForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.movimientoForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('min')) {
      return `Valor mínimo: ${control.errors?.['min'].min}`;
    }
    return '';
  }
}