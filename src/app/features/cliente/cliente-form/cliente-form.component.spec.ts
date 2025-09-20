import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ClienteFormComponent } from './cliente-form.component';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';

describe('ClienteFormComponent', () => {
  let component: ClienteFormComponent;
  let fixture: ComponentFixture<ClienteFormComponent>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    const clienteServiceMock = jasmine.createSpyObj('ClienteService', ['getById', 'create', 'update']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ id: '1' })
    });

    await TestBed.configureTestingModule({
      declarations: [ClienteFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ClienteService, useValue: clienteServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteFormComponent);
    component = fixture.componentInstance;
    clienteServiceSpy = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRouteSpy = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.clienteForm).toBeDefined();
    expect(component.clienteForm.get('clienteId')?.value).toBe('');
    expect(component.clienteForm.get('estado')?.value).toBe(true);
  });

  it('should load cliente data in edit mode', () => {
    const mockCliente: Cliente = {
      id: 1,
      clienteId: 'CLI001',
      nombre: 'Test Cliente',
      genero: 1,
      edad: 30,
      numeroIdentificacion: '1234567890',
      tipoIdentificacion: 'Cedula',
      direccion: 'Test Address',
      telefono: '0987654321',
      contrasena: 'password',
      estado: true
    };

    clienteServiceSpy.getById.and.returnValue(of(mockCliente));

    component.ngOnInit();

    expect(clienteServiceSpy.getById).toHaveBeenCalledWith(1);
    expect(component.clienteForm.get('clienteId')?.value).toBe('CLI001');
  });

  it('should create cliente on submit', () => {
    component.clienteForm.setValue({
      clienteId: 'CLI001',
      nombre: 'Test Cliente',
      genero: 1,
      edad: 30,
      numeroIdentificacion: '1234567890',
      tipoIdentificacion: 'Cedula',
      direccion: 'Test Address',
      telefono: '0987654321',
      contrasena: 'password',
      estado: true
    });

    clienteServiceSpy.create.and.returnValue(of({} as Cliente));

    component.onSubmit();

    expect(clienteServiceSpy.create).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/clientes']);
  });

  it('should show error message for invalid form', () => {
    component.clienteForm.get('clienteId')?.setValue('');
    component.onSubmit();

    expect(component.clienteForm.get('clienteId')?.touched).toBe(true);
  });
});