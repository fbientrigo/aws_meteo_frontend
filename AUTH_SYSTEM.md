# Sistema de Autenticación y Gestión de Usuarios

Este documento describe el sistema completo de autenticación, control de acceso y gestión de usuarios implementado en la aplicación AgriVibe.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Componentes Principales](#componentes-principales)
- [Roles y Permisos](#roles-y-permisos)
- [Onboarding](#onboarding)
- [Uso](#uso)

## ✨ Características

### Autenticación
- ✅ Login con email y contraseña
- ✅ Registro de nuevos usuarios
- ✅ Gestión de sesiones persistentes
- ✅ Protección de rutas
- ✅ Redirección automática después del login

### Gestión de Perfil
- ✅ Perfil de usuario completo
- ✅ Avatar personalizable
- ✅ Información personal editable
- ✅ Preferencias de usuario (tema, idioma, notificaciones)
- ✅ Estadísticas de uso

### Control de Acceso
- ✅ Sistema de roles (Admin, Manager, Operator, Viewer)
- ✅ Permisos granulares por rol
- ✅ Validación de permisos en componentes
- ✅ Badges visuales de roles

### Onboarding
- ✅ Flujo de bienvenida interactivo
- ✅ 4 pasos guiados
- ✅ Configuración inicial de preferencias
- ✅ Animaciones fluidas
- ✅ Progreso guardado

## 🏗️ Arquitectura

### Estructura de Archivos

```
src/
├── types/
│   └── user.ts                    # Tipos y definiciones de usuario
├── hooks/
│   └── useAuth.ts                 # Hook principal de autenticación
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.tsx     # Componente de ruta protegida
│   │   ├── UserMenu.tsx           # Menú desplegable de usuario
│   │   ├── RoleBadge.tsx          # Badge de rol con tooltip
│   │   └── AuthLayout.tsx         # Layout para páginas de auth
│   └── onboarding/
│       ├── OnboardingFlow.tsx     # Flujo principal de onboarding
│       └── steps/
│           ├── OnboardingStep1.tsx # Bienvenida
│           ├── OnboardingStep2.tsx # Perfil
│           ├── OnboardingStep3.tsx # Características
│           └── OnboardingStep4.tsx # Configuración
└── pages/
    ├── Login.tsx                  # Página de login
    ├── Register.tsx               # Página de registro
    └── UserProfile.tsx            # Página de perfil de usuario
```

## 🔧 Componentes Principales

### useAuth Hook

El hook principal para gestionar la autenticación:

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { 
    user,           // Usuario actual
    profile,        // Perfil completo
    permissions,    // Permisos del usuario
    isAuthenticated,// Estado de autenticación
    signIn,         // Función de login
    signOut,        // Función de logout
    updateProfile,  // Actualizar perfil
  } = useAuth();
  
  // Usar en tu componente
}
```

### ProtectedRoute

Protege rutas que requieren autenticación:

```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### UserMenu

Menú desplegable con opciones de usuario:

```tsx
import { UserMenu } from '@/components/auth/UserMenu';

<UserMenu />
```

### RoleBadge

Muestra el rol del usuario con información de permisos:

```tsx
import { RoleBadge } from '@/components/auth/RoleBadge';

<RoleBadge role={profile.role} showTooltip={true} />
```

## 👥 Roles y Permisos

### Roles Disponibles

| Rol | Descripción | Color |
|-----|-------------|-------|
| **Admin** | Acceso completo al sistema | 🔴 Rojo |
| **Manager** | Gestión de granjas y reportes | 🔵 Azul |
| **Operator** | Edición de granjas y visualización | 🟢 Verde |
| **Viewer** | Solo lectura | ⚫ Gris |

### Matriz de Permisos

| Permiso | Admin | Manager | Operator | Viewer |
|---------|-------|---------|----------|--------|
| Crear granjas | ✅ | ✅ | ❌ | ❌ |
| Editar granjas | ✅ | ✅ | ✅ | ❌ |
| Eliminar granjas | ✅ | ❌ | ❌ | ❌ |
| Gestionar usuarios | ✅ | ❌ | ❌ | ❌ |
| Ver reportes | ✅ | ✅ | ✅ | ✅ |
| Exportar datos | ✅ | ✅ | ❌ | ❌ |
| Gestionar configuración | ✅ | ❌ | ❌ | ❌ |

### Uso de Permisos en Componentes

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { permissions } = useAuth();
  
  return (
    <div>
      {permissions.canCreateFarms && (
        <Button onClick={createFarm}>Crear Granja</Button>
      )}
      
      {permissions.canDeleteFarms && (
        <Button variant="destructive">Eliminar</Button>
      )}
    </div>
  );
}
```

## 🎯 Onboarding

### Flujo de Onboarding

El sistema incluye un onboarding interactivo de 4 pasos:

#### Paso 1: Bienvenida
- Introducción a la plataforma
- Características principales
- Animaciones de entrada

#### Paso 2: Perfil
- Completar información personal
- Nombre, empresa, teléfono
- Validación de formulario

#### Paso 3: Características
- Tour de funcionalidades
- Tarjetas interactivas
- Tips y consejos

#### Paso 4: Configuración
- Selección de tema (Light/Dark/System)
- Idioma (EN/ES/PT)
- Preferencias de notificaciones

### Personalización del Onboarding

```tsx
// El onboarding se muestra automáticamente para nuevos usuarios
// Se puede saltar o completar
// El progreso se guarda automáticamente

// Para forzar mostrar el onboarding:
await updateProfile({
  onboarding: {
    completed: false,
    currentStep: 0,
    completedSteps: [],
    skipped: false,
  },
});
```

## 📖 Uso

### Login

```tsx
// En tu componente de login
const { signIn } = useAuth();

const handleLogin = async (email: string, password: string) => {
  const { error } = await signIn(email, password);
  
  if (error) {
    toast.error(error.message);
  } else {
    navigate('/dashboard');
  }
};
```

### Registro

```tsx
// En tu componente de registro
const { signUp } = useAuth();

const handleRegister = async (email: string, password: string, name: string) => {
  const { error } = await signUp(email, password, name);
  
  if (error) {
    toast.error(error.message);
  } else {
    navigate('/dashboard'); // Onboarding se mostrará automáticamente
  }
};
```

### Logout

```tsx
const { signOut } = useAuth();

const handleLogout = async () => {
  await signOut();
  navigate('/login');
};
```

### Actualizar Perfil

```tsx
const { updateProfile } = useAuth();

const handleUpdateProfile = async (data: Partial<UserProfile>) => {
  const { error } = await updateProfile(data);
  
  if (error) {
    toast.error('Error al actualizar perfil');
  } else {
    toast.success('Perfil actualizado');
  }
};
```

## 🔐 Seguridad

### Mejores Prácticas Implementadas

1. **Sesiones Persistentes**: Las sesiones se mantienen en localStorage de forma segura
2. **Validación de Rutas**: Todas las rutas protegidas verifican autenticación
3. **Tokens**: Sistema de tokens para autenticación (preparado para Supabase)
4. **Validación de Formularios**: Zod schema para validación robusta
5. **Manejo de Errores**: Gestión centralizada de errores de autenticación

## 🚀 Próximos Pasos

### Mejoras Futuras

- [ ] Autenticación de dos factores (2FA)
- [ ] Login con redes sociales (Google, GitHub)
- [ ] Recuperación de contraseña
- [ ] Cambio de contraseña
- [ ] Verificación de email
- [ ] Gestión de sesiones múltiples
- [ ] Logs de actividad del usuario
- [ ] Gestión de equipos/organizaciones

## 📝 Notas de Desarrollo

### Modo Mock vs Supabase

Actualmente el sistema usa un servicio mock para desarrollo. Para cambiar a Supabase real:

```typescript
// En src/services/api.ts
// Cambiar de:
export const api = mockApiService;
// A:
export const api = supabaseService;
```

### Variables de Entorno

Asegúrate de configurar las variables de entorno en `.env`:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=tu_clave_publica
```

## 🤝 Contribuir

Para agregar nuevos roles o permisos:

1. Actualizar `src/types/user.ts`
2. Agregar el rol a `UserRole` type
3. Definir permisos en `rolePermissions`
4. Actualizar componentes que usen permisos

---

**Desarrollado con ❤️ para AgriVibe**
