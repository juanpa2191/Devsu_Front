import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovimientoService } from '../../../core/services/movimiento.service';
import { Movimiento } from '../../../core/models/movimiento.model';

@Component({
  selector: 'app-movimiento-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movimiento-list.component.html',
  styleUrls: ['./movimiento-list.component.css']
})
export class MovimientoListComponent implements OnInit {
  movimientos: Movimiento[] = [];
  filteredMovimientos: Movimiento[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private movimientoService: MovimientoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMovimientos();
  }

  loadMovimientos(): void {
    this.loading = true;
    this.movimientoService.getAll().subscribe({
      next: (data) => {
        this.movimientos = data;
        this.filteredMovimientos = data;
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
      this.filteredMovimientos = this.movimientos;
    } else {
      this.filteredMovimientos = this.movimientos.filter(movimiento =>
        movimiento.cuenta?.numeroCuenta.includes(term) ||
        movimiento.fecha.includes(term)
      );
    }
  }

  onEdit(movimiento: Movimiento): void {
    this.router.navigate(['/movimientos/edit', movimiento.id]);
  }

  onDelete(movimiento: Movimiento): void {
    if (confirm(`¿Está seguro de eliminar este movimiento?`)) {
      this.movimientoService.delete(movimiento.id!).subscribe({
        next: () => {
          this.loadMovimientos();
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
    }
  }

  onAdd(): void {
    this.router.navigate(['/movimientos/new']);
  }

  onView(movimiento: Movimiento): void {
    this.router.navigate(['/movimientos', movimiento.id]);
  }

  getTipoMovimientoLabel(tipo: number): string {
    return tipo === 1 ? 'Depósito' : 'Retiro';
  }
}