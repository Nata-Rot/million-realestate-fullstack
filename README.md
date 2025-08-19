# Million RealEstate – Prueba Técnica Fullstack

Tecnologías usadas:
- Backend: .NET 8 (Minimal API), C#, MongoDB Driver
- Base de datos: MongoDB
- Frontend: visual studio code "Next.js 14 (App Router) + Tailwind CSS"
- Testing: NUnit
- Documentación: Swagger UI
- Utilidades: Postman collection para pruebas rápidas

## Requisitos previos
- .NET SDK 8.x
- Node.js 18+
- MongoDB 6+ en local (o cadena de conexión propia)

## Paso a paso

### 1) Base de datos
- Asegúrese de tener MongoDB ejecutando en `mongodb://localhost:27017`.
- La base por defecto es `millionRealEstate` y la colección `properties`.
- Puede poblar datos de ejemplo con el endpoint de _seed_:

```bash
cd backend/Million.RealEstate.Api
dotnet run
# En otra terminal:
curl -X POST http://localhost:5242/api/dev/seed
```

Si usa la URL HTTPS de launchSettings, ajuste el puerto respectivo.

### 2) Backend
```bash
cd backend/Million.RealEstate.Api
dotnet run
# Swagger disponible en: http://localhost:5242/swagger
```

Variables de configuración via `appsettings.json` (sección `Mongo`).

### 3) Frontend
```bash
cd frontend
cp .env.example .env.local  # (edite NEXT_PUBLIC_API_URL si es necesario)
npm install
npm run dev
# Abrir http://localhost:3000
```

* Index principal Inmobiliaría, Propiedades:
<img width="1901" height="1097" alt="image" src="https://github.com/user-attachments/assets/80f444cb-18ea-4b3a-aaba-3f6fc025ea40" />
* Detalle Propiedad:
<img width="1855" height="1077" alt="image" src="https://github.com/user-attachments/assets/8a89cf55-fb12-4d2b-842b-a3289e37ce17" />

### 4) Tests (NUnit)
```bash
cd backend/Million.RealEstate.Tests
dotnet test
```

## Endpoints
- `GET /api/properties` – filtros: `name`, `address`, `minPrice`, `maxPrice`, `page`, `pageSize`
- `GET /api/properties/{id}`
- `POST /api/dev/seed` – Solo para entorno de desarrollo; inserta datos del archivo `data/seed/properties.json`

## Notas de diseño
- Separación de capas Core/Infrastructure/Api con repositorio para MongoDB.
- Filtros con expresiones regulares (case-insensitive) para `name` y `address`.
- Orden por precio ascendente y paginación.
- Frontend responsive con tarjetas, filtros y vista de detalle.
- Imágenes con `next/image` con patrón remoto habilitado.

<img width="1885" height="1063" alt="image" src="https://github.com/user-attachments/assets/d199f98e-3503-419e-ad01-12cda9ce1fbc" />
<img width="1817" height="1032" alt="image" src="https://github.com/user-attachments/assets/41130ca7-e8a4-4eb6-99d3-a57bbe353dc9" />
<img width="1717" height="941" alt="image" src="https://github.com/user-attachments/assets/c1803ec0-2f32-47ce-9209-c948fff4a8d0" />
<img width="1812" height="1042" alt="image" src="https://github.com/user-attachments/assets/8e773f10-b5ec-45e4-8cab-f2c5af854ad7" />
<img width="1716" height="717" alt="image" src="https://github.com/user-attachments/assets/06e47871-d0a3-44b8-b624-c3d8c43f3f6a" />
<img width="1728" height="1020" alt="image" src="https://github.com/user-attachments/assets/f1d2fdbc-5108-4e84-b02f-e8c45f0c4f9d" />
<img width="1831" height="743" alt="image" src="https://github.com/user-attachments/assets/720555b7-1795-43a8-8a78-924892871f73" />













