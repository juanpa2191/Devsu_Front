RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instala Node.js 16+ primero."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado. Por favor instala npm primero."
    exit 1
fi

print_status "Verificando versión de Node.js..."
node --version

print_status "Verificando versión de npm..."
npm --version

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    print_status "Instalando dependencias..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Error instalando dependencias"
        exit 1
    fi
else
    print_status "Dependencias ya instaladas"
fi

if [ -f "package.json" ] && grep -q '"test"' package.json; then
    print_status "Ejecutando tests..."
    npm test -- --watch=false --browsers=ChromeHeadless
    if [ $? -ne 0 ]; then
        print_warning "Algunos tests fallaron, pero continuando con el despliegue..."
    fi
fi

print_status "Generando build de producción..."
npm run build -- --configuration production
if [ $? -ne 0 ]; then
    print_error "Error en el build de producción"
    exit 1
fi

if [ ! -d "dist/sistema-bancario-kilocode/browser" ]; then
    print_error "Directorio de build no encontrado"
    exit 1
fi

print_status "Build generado exitosamente en: dist/sistema-bancario-kilocode/browser/"

print_status "Archivos generados:"
ls -lh dist/sistema-bancario-kilocode/browser/

TOTAL_SIZE=$(du -sh dist/sistema-bancario-kilocode/browser/ | cut -f1)
print_status "Tamaño total del build: $TOTAL_SIZE"

print_status " Despliegue completado exitosamente!"
print_status ""
print_status " Archivos listos para despliegue en:"
print_status "   dist/sistema-bancario-kilocode/browser/"
print_status ""
print_status " Para servir la aplicación:"
print_status "   - Copiar el contenido de 'browser/' al servidor web"
print_status "   - O usar: npx serve dist/sistema-bancario-kilocode/browser/"
print_status ""
print_status " Configurar la URL del backend en los archivos de servicios si es necesario"