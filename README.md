# 🌾 AgroRisk - Sistema de Gestión de Riesgos Agroclimáticos

Sistema de monitoreo y gestión de riesgos climatológicos para la agricultura, con mapas interactivos, análisis de riesgos en tiempo real y asistente de IA.

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración del Backend](#-configuración-del-backend)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Deploy en AWS](#-deploy-en-aws)

---

## ✨ Características

- 🗺️ **Mapas Interactivos** - Visualización de predios y potreros con Leaflet
- 🌡️ **Heatmaps de Riesgos** - Capas de calor para sequía, heladas, inundaciones
- 📊 **Dashboard Analítico** - Estadísticas y métricas de riesgos
- 🤖 **Asistente IA** - Chat inteligente para recomendaciones
- 👤 **Sistema de Usuarios** - Autenticación completa con roles
- 📱 **Responsive** - Optimizado para móvil y desktop

---

## 📦 Requisitos

- Node.js 18+
- npm o yarn
- Cuenta en Supabase (o backend propio en AWS)

---

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd agrorisk-frontend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Iniciar en desarrollo
npm run dev
```

---

## ⚙️ Configuración del Backend

### Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# ============================================
# Supabase (Recomendado para inicio rápido)
# ============================================
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key

# ============================================
# API Custom (Si usas backend propio)
# ============================================
VITE_API_URL=https://api.tudominio.com

# ============================================
# Feature Flags
# ============================================
VITE_USE_MOCK_DATA=false  # true para desarrollo sin backend
```

### Esquema de Base de Datos

Ejecuta este SQL en Supabase o tu base de datos PostgreSQL:

```sql
-- Tabla de Perfiles de Usuario
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'viewer',
  preferences JSONB DEFAULT '{}',
  onboarding JSONB DEFAULT '{"completed": false, "currentStep": 0, "completedSteps": [], "skipped": false}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Predios
CREATE TABLE parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  area DECIMAL,
  geojson JSONB NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Potreros
CREATE TABLE paddocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID REFERENCES parcels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  area DECIMAL,
  geojson JSONB NOT NULL,
  crop_type TEXT,
  irrigation_type TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_parcels_user_id ON parcels(user_id);
CREATE INDEX idx_paddocks_parcel_id ON paddocks(parcel_id);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE paddocks ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own parcels" ON parcels FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage paddocks in own parcels" ON paddocks FOR ALL 
  USING (parcel_id IN (SELECT id FROM parcels WHERE user_id = auth.uid()));
```

---

## 🔌 API Endpoints

### Autenticación (`/auth`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/signup` | Registro de usuario |
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/logout` | Cerrar sesión |
| GET | `/auth/session` | Verificar sesión actual |

### Perfiles (`/profiles`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/profiles/:id` | Obtener perfil de usuario |
| PUT | `/profiles/:id` | Actualizar perfil |
| PATCH | `/profiles/:id/onboarding` | Actualizar estado de onboarding |

### Predios (`/parcels`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/parcels` | Listar todos los predios del usuario |
| POST | `/parcels` | Crear nuevo predio |
| GET | `/parcels/:id` | Obtener predio específico |
| PUT | `/parcels/:id` | Actualizar predio |
| DELETE | `/parcels/:id` | Eliminar predio |

**Body para crear predio:**
```json
{
  "name": "Predio Norte",
  "area": 150.5,
  "geojson": {
    "type": "Polygon",
    "coordinates": [[[-70.5, -33.4], [-70.4, -33.4], [-70.4, -33.3], [-70.5, -33.3], [-70.5, -33.4]]]
  },
  "color": "#3b82f6"
}
```

### Potreros (`/paddocks`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/parcels/:parcelId/paddocks` | Crear potrero en un predio |
| PUT | `/paddocks/:id` | Actualizar potrero |
| DELETE | `/paddocks/:id` | Eliminar potrero |

**Body para crear potrero:**
```json
{
  "name": "Potrero A",
  "area": 25.3,
  "geojson": { "type": "Polygon", "coordinates": [...] },
  "crop_type": "wheat",
  "irrigation_type": "drip",
  "description": "Zona de cultivo principal"
}
```

### Riesgos (`/risks`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/risks/heatmap?type=drought` | Datos de mapa de calor |
| GET | `/risks/forecast?parcel_id=xxx` | Pronóstico de riesgos |

### Chat IA (`/chat`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/chat/message` | Enviar mensaje al asistente |
| GET | `/chat/history` | Obtener historial de chat |

**Body para mensaje:**
```json
{
  "message": "¿Qué cultivos recomiendas para mi zona?",
  "context": {
    "parcel_id": "uuid",
    "current_risks": ["drought"]
  }
}
```

---

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── auth/           # Autenticación
│   ├── map/            # Componentes del mapa
│   ├── onboarding/     # Flujo de onboarding
│   ├── sidebar/        # Tabs del sidebar
│   └── ui/             # Componentes shadcn/ui
├── hooks/              # Custom hooks
│   ├── useAuth.ts      # Hook de autenticación
│   ├── useFarmLayers.ts
│   └── useSTIData.ts
├── pages/              # Páginas/rutas
│   ├── Dashboard.tsx
│   ├── Landing.tsx
│   ├── Login.tsx
│   └── Onboarding.tsx
├── services/           # Servicios de API
│   ├── api.ts          # API principal (mock/real)
│   └── backendApi.ts   # Conexión con backend
├── store/              # Estado global (Zustand)
│   └── useAppStore.ts
├── types/              # Tipos TypeScript
└── utils/              # Utilidades
```

---

## ☁️ Deploy en AWS

### Opción 1: S3 + CloudFront (Recomendado)

```bash
# Build para producción
npm run build

# Subir a S3
aws s3 sync dist/ s3://tu-bucket-frontend --delete

# Invalidar cache de CloudFront
aws cloudfront create-invalidation --distribution-id XXXXX --paths "/*"
```

### Opción 2: Amplify

1. Conecta tu repo en AWS Amplify Console
2. Configura las variables de entorno
3. Deploy automático en cada push

### Variables de entorno en producción

En AWS, configura estas variables:

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_USE_MOCK_DATA=false
VITE_API_URL=https://api.tudominio.com
```

---

## 🛠️ Desarrollo

```bash
# Desarrollo con hot reload
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

---

## 📝 Licencia

Este proyecto es privado y confidencial.

---

## 🤝 Soporte

Para preguntas o soporte, contacta al equipo de desarrollo.
