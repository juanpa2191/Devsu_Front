import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CuentaService } from '../../../core/services/cuenta.service';
import { Cuenta } from '../../../core/models/cuenta.model';

@Component({
  selector: 'app-cuenta-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cuenta-list.component.html',
  styleUrls: ['./cuenta-list.component.css']
})
export class CuentaListComponent implements OnInit {
  cuentas: Cuenta[] = [];
  filteredCuentas: Cuenta[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private cuentaService: CuentaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCuentas();
  }

  loadCuentas(): void {
    this.loading = true;
    this.cuentaService.getAll().subscribe({
      next: (data) => {
        this.cuentas = data;
        this.filteredCuentas = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    const term = target?.value || '';
    if (!term) {
      this.filteredCuentas = this.cuentas;
    } else {
      this.filteredCuentas = this.cuentas.filter(cuenta =>
        cuenta.numeroCuenta.includes(term) ||
        cuenta.cliente?.nombre.toLowerCase().includes(term.toLowerCase())
      );
    }
  }

  onEdit(cuenta: Cuenta): void {
    this.router.navigate(['/cuentas/edit', cuenta.id]);
  }

  onDelete(cuenta: Cuenta): void {
    if (confirm(`¿Está seguro de eliminar la cuenta ${cuenta.numeroCuenta}?`)) {
      this.cuentaService.delete(cuenta.id!).subscribe({
        next: () => {
          this.loadCuentas();
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
    }
  }

  onAdd(): void {
    this.router.navigate(['/cuentas/new']);
  }

  onView(cuenta: Cuenta): void {
    this.router.navigate(['/cuentas', cuenta.id]);
  }

  getTipoCuentaLabel(tipo: number): string {
    return tipo === 1 ? 'Ahorro' : 'Corriente';
  }
}