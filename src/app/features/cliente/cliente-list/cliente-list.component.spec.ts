import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ClienteListComponent } from './cliente-list.component';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';

describe('ClienteListComponent', () => {
  let component: ClienteListComponent;
  let fixture: ComponentFixture<ClienteListComponent>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const clienteServiceMock = jasmine.createSpyObj('ClienteService', ['getAll', 'delete']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ClienteListComponent],
      providers: [
        { provide: ClienteService, useValue: clienteServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteListComponent);
    component = fixture.componentInstance;
    clienteServiceSpy = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clientes on init', () => {
    const mockClientes: Cliente[] = [
      {
        id: 1,
        clienteId: 'CLI001',
        nombre: 'Test Cliente',
        genero: 1,
        edad: 30,
        numeroIdentificacion: '123456789',
        tipoIdentificacion: 'Cedula',
        direccion: 'Test Address',
        telefono: '1234567890',
        contrasena: 'password',
        estado: true
      }
    ];

    clienteServiceSpy.getAll.and.returnValue(of(mockClientes));

    component.ngOnInit();

    expect(clienteServiceSpy.getAll).toHaveBeenCalled();
    expect(component.clientes).toEqual(mockClientes);
    expect(component.filteredClientes).toEqual(mockClientes);
  });

  it('should filter clientes based on search term', () => {
    component.clientes = [
      {
        id: 1,
        clienteId: 'CLI001',
        nombre: 'Juan Perez',
        genero: 1,
        edad: 30,
        numeroIdentificacion: '123456789',
        tipoIdentificacion: 'Cedula',
        direccion: 'Test Address',
        telefono: '1234567890',
        contrasena: 'password',
        estado: true
      },
      {
        id: 2,
        clienteId: 'CLI002',
        nombre: 'Maria Lopez',
        genero: 2,
        edad: 25,
        numeroIdentificacion: '987654321',
        tipoIdentificacion: 'Cedula',
        direccion: 'Test Address 2',
        telefono: '0987654321',
        contrasena: 'password2',
        estado: true
      }
    ];

    component.onSearch('Juan');

    expect(component.filteredClientes.length).toBe(1);
    expect(component.filteredClientes[0].nombre).toBe('Juan Perez');
  });
});