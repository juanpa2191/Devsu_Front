import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  filteredClientes: Cliente[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.loading = true;
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data;
        this.filteredClientes = data;
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
      this.filteredClientes = this.clientes;
    } else {
      this.filteredClientes = this.clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(term.toLowerCase()) ||
        cliente.numeroIdentificacion.includes(term) ||
        cliente.clienteId.toLowerCase().includes(term.toLowerCase())
      );
    }
  }

  onEdit(cliente: Cliente): void {
    this.router.navigate(['/clientes/edit', cliente.id]);
  }

  onDelete(cliente: Cliente): void {
    if (confirm(`¿Está seguro de eliminar al cliente ${cliente.nombre}?`)) {
      this.clienteService.delete(cliente.id!).subscribe({
        next: () => {
          this.loadClientes();
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
    }
  }

  onAdd(): void {
    this.router.navigate(['/clientes/new']);
  }

  onView(cliente: Cliente): void {
    this.router.navigate(['/clientes', cliente.id]);
  }
}