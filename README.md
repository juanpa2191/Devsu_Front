# Sistema Bancario - Frontend Angular

##  Descripción
Aplicación web frontend para gestión de sistema bancario desarrollada con Angular 15. Incluye gestión completa de clientes, cuentas y movimientos bancarios.

##  Características Principales

###  Gestión de Clientes
-  CRUD completo de clientes
-  Validaciones de formularios
-  Búsqueda y filtrado
-  Estados activo/inactivo

###  Gestión de Cuentas
-  Cuentas de ahorro y corriente
-  Validación de números de cuenta
-  Asociación con clientes
-  Estados de cuentas

###  Gestión de Movimientos
-  Depósitos y retiros
-  Validaciones de negocio
-  Límite diario de retiro ($1000)
-  Cálculo automático de saldos

##  Tecnologías Utilizadas

- **Angular 15** - Framework principal
- **TypeScript** - Lenguaje de programación
- **RxJS** - Programación reactiva
- **CSS3** - Estilos personalizados
- **Angular Router** - Navegación SPA
- **Angular Forms** - Formularios reactivos

##  Instalación y Despliegue

### Prerrequisitos
- Node.js 16+
- npm o yarn

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm start
# o
ng serve
```

### Producción
```bash
npm run build --prod
```

### Despliegue
Los archivos de producción se generan en `dist/sistema-bancario-kilocode/browser/`

##  Configuración

### API Backend
Configurar la URL del backend en los servicios:
- `src/app/core/services/cliente.service.ts`
- `src/app/core/services/cuenta.service.ts`
- `src/app/core/services/movimiento.service.ts`

```typescript
private apiUrl = 'https://tu-backend-api.com/api';
```

##  Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Interfaces TypeScript
│   │   └── services/        # Servicios API
│   ├── features/            # Módulos de características
│   │   ├── cliente/         # Gestión de clientes
│   │   ├── cuenta/          # Gestión de cuentas
│   │   └── movimiento/      # Gestión de movimientos
│   ├── app.component.*      # Componente raíz
│   ├── app.config.ts        # Configuración Angular
│   └── app.routes.ts        # Definición de rutas
├── assets/                  # Recursos estáticos
├── index.html              # Archivo HTML principal
└── styles.css              # Estilos globales
```

##  Características de UI/UX

-  Diseño responsive
-  Navegación vertical moderna
-  Formularios con validaciones visuales
-  Mensajes de error y éxito
-  Estados de carga
-  Sin dependencias de frameworks CSS externos

##  Validaciones Implementadas

### Clientes
- ID único con formato CLI001
- Nombres requeridos (mín. 2 caracteres)
- Edad entre 18-100 años
- Identificación válida (10-13 dígitos)
- Teléfono de 10 dígitos

### Cuentas
- Número de cuenta de 6 dígitos
- Tipo: Ahorro/Corriente
- Saldo inicial mínimo $0
- Asociación obligatoria con cliente

### Movimientos
- Valores positivos para depósitos
- Validación de saldo disponible para retiros
- Límite diario de $1000 para retiros
- Cálculo automático de saldos

##  Rendimiento

-  Bundle optimizado para producción
-  Lazy loading de componentes
-  Tree shaking automático
-  Compresión GZIP
-  Tamaño total: ~250KB (comprimido)

##  Despliegue en Producción

### Servidor Web
```bash
# Apache/Nginx
# Copiar contenido de dist/sistema-bancario-kilocode/browser/
# a la carpeta pública del servidor web
```

### Docker (Opcional)
```dockerfile
FROM nginx:alpine
COPY dist/sistema-bancario-kilocode/browser/ /usr/share/nginx/html/
EXPOSE 80
```

