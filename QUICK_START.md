# 🚀 Guía Rápida de Inicio - Sistema de Autenticación

## 📋 Resumen

Se ha implementado un **sistema completo de autenticación y gestión de usuarios** para tu aplicación AgriVibe. Este sistema incluye:

- ✅ Login y registro de usuarios
- ✅ Perfil de usuario completo
- ✅ Sistema de roles y permisos
- ✅ Onboarding interactivo para nuevos usuarios
- ✅ Control de acceso por rutas

## 🎯 Cómo Probar el Sistema

### 1. Acceder a la Aplicación

La aplicación ya está corriendo en: **http://localhost:8080**

### 2. Probar el Login

1. Navega a: **http://localhost:8080/login**
2. Ingresa cualquier email y contraseña (el sistema usa datos mock)
3. Click en "Sign In"
4. Serás redirigido al dashboard

**Características del Login:**
- ✅ Validación de formulario
- ✅ Botón de mostrar/ocultar contraseña
- ✅ Checkbox "Remember me"
- ✅ Link "Forgot password?"
- ✅ Loading state durante el login

### 3. Probar el Registro

1. Navega a: **http://localhost:8080/register**
2. Completa el formulario con:
   - Email válido
   - Contraseña (mínimo 6 caracteres)
   - Confirmar contraseña
3. Click en "Create Account"
4. Serás redirigido al onboarding

### 4. Experimentar el Onboarding

Después de registrarte, verás un **flujo de onboarding de 4 pasos**:

**Paso 1: Bienvenida**
- Introducción a la plataforma
- Características principales

**Paso 2: Perfil**
- Completar información personal
- Nombre, empresa, teléfono

**Paso 3: Características**
- Tour de funcionalidades
- Tarjetas interactivas

**Paso 4: Configuración**
- Seleccionar tema (Light/Dark/System)
- Elegir idioma (EN/ES/PT)
- Configurar notificaciones

**Navegación:**
- Usa los botones "Back" y "Next"
- Puedes saltar el onboarding con la X
- El progreso se guarda automáticamente

### 5. Explorar el Perfil de Usuario

1. Click en tu avatar en el header (esquina superior derecha)
2. Selecciona "Profile" del menú desplegable
3. Explora las 3 pestañas:

**Pestaña Perfil:**
- Editar información personal
- Ver estadísticas de uso
- Cambiar avatar (preparado)

**Pestaña Preferencias:**
- Cambiar tema
- Cambiar idioma
- Configurar notificaciones

**Pestaña Seguridad:**
- Ver permisos del rol
- Cambiar contraseña (preparado)
- Eliminar cuenta (preparado)

### 6. Probar el Menú de Usuario

Click en tu avatar para ver:
- Nombre y email
- Badge de rol
- Opciones de perfil
- Configuración
- Privacidad y seguridad
- Ayuda y soporte
- Cerrar sesión

## 🎨 Características Visuales

### Temas
El sistema soporta 3 temas:
- 🌞 **Light**: Tema claro
- 🌙 **Dark**: Tema oscuro
- 💻 **System**: Sigue el tema del sistema

### Animaciones
- Transiciones suaves entre pasos del onboarding
- Hover effects en tarjetas y botones
- Loading states animados
- Toasts de notificación

### Responsive
- ✅ Mobile (< 768px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (> 1024px)

## 👥 Roles de Usuario

El sistema incluye 4 roles predefinidos:

### 🔴 Admin
- **Acceso completo** al sistema
- Puede gestionar usuarios
- Puede eliminar granjas

### 🔵 Manager
- Puede crear y editar granjas
- Puede ver y exportar reportes
- No puede gestionar usuarios

### 🟢 Operator
- Puede editar granjas
- Puede ver reportes
- No puede crear ni eliminar

### ⚫ Viewer
- **Solo lectura**
- Puede ver reportes
- No puede editar nada

## 🔧 Funcionalidades Técnicas

### Validación de Formularios
Todos los formularios usan **Zod** para validación:
- Email válido
- Contraseña mínimo 6 caracteres
- Confirmación de contraseña
- Campos requeridos

### Gestión de Estado
- **useAuth hook** para autenticación
- LocalStorage para persistencia
- Zustand preparado para estado global

### Protección de Rutas
Las rutas protegidas requieren autenticación:
- `/dashboard` - Requiere login
- `/profile` - Requiere login
- Redirección automática a `/login` si no autenticado

### Notificaciones
Sistema de toasts con **Sonner**:
- Success messages
- Error messages
- Loading states
- Información contextual

## 📱 Flujo de Usuario Completo

```
1. Usuario visita la app
   ↓
2. Redirigido a /login (si no autenticado)
   ↓
3. Login o Registro
   ↓
4. Onboarding (solo nuevos usuarios)
   ↓
5. Dashboard
   ↓
6. Puede acceder a:
   - Perfil de usuario
   - Configuración
   - Todas las funcionalidades según su rol
```

## 🎯 Casos de Uso

### Caso 1: Nuevo Usuario
1. Registrarse en `/register`
2. Completar onboarding (4 pasos)
3. Acceder al dashboard
4. Explorar funcionalidades

### Caso 2: Usuario Existente
1. Login en `/login`
2. Acceso directo al dashboard
3. Continuar trabajo

### Caso 3: Editar Perfil
1. Click en avatar
2. Seleccionar "Profile"
3. Editar información
4. Guardar cambios

### Caso 4: Cambiar Preferencias
1. Ir a perfil
2. Pestaña "Preferences"
3. Cambiar tema/idioma/notificaciones
4. Cambios se aplican inmediatamente

## 🔐 Seguridad

### Implementado
- ✅ Validación de formularios
- ✅ Protección de rutas
- ✅ Gestión de sesiones
- ✅ Tokens de autenticación (preparado)

### Preparado para Producción
- 🔄 Integración con Supabase
- 🔄 Verificación de email
- 🔄 Recuperación de contraseña
- 🔄 2FA (Two-Factor Authentication)

## 📚 Documentación

Para más detalles técnicos, consulta:
- **AUTH_SYSTEM.md** - Documentación completa del sistema
- **IMPLEMENTATION_SUMMARY.md** - Resumen de implementación

## 🐛 Troubleshooting

### El onboarding no aparece
- Verifica que el usuario sea nuevo
- Limpia localStorage: `localStorage.clear()`
- Recarga la página

### No puedo acceder a ciertas funciones
- Verifica tu rol de usuario
- Algunos permisos están restringidos por rol

### La sesión no persiste
- Verifica que localStorage esté habilitado
- Revisa la consola del navegador para errores

## 🎉 ¡Listo para Usar!

El sistema está **completamente funcional** y listo para:
- ✅ Desarrollo
- ✅ Testing
- ✅ Demostración
- 🔄 Producción (después de configurar Supabase)

---

**¿Preguntas o necesitas ayuda?**
Consulta la documentación completa en `AUTH_SYSTEM.md`
