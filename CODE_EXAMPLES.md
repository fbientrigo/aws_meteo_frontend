# 💻 Ejemplos de Código - Sistema de Autenticación

Este documento contiene ejemplos prácticos de cómo usar el sistema de autenticación en diferentes escenarios.

## 📋 Tabla de Contenidos

- [Uso Básico](#uso-básico)
- [Componentes Protegidos](#componentes-protegidos)
- [Validación de Permisos](#validación-de-permisos)
- [Gestión de Perfil](#gestión-de-perfil)
- [Onboarding Personalizado](#onboarding-personalizado)

## 🎯 Uso Básico

### Obtener Información del Usuario

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, profile, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile?.full_name}!</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {profile?.role}</p>
    </div>
  );
}
```

### Login Programático

```tsx
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function LoginButton() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await signIn('user@example.com', 'password123');
    
    if (error) {
      toast.error('Login failed: ' + error.message);
    } else {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### Logout

```tsx
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

## 🔒 Componentes Protegidos

### Proteger una Ruta

```tsx
// En App.tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

### Componente Condicional por Autenticación

```tsx
import { useAuth } from '@/hooks/useAuth';

function ConditionalComponent() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to your dashboard</p>
        </div>
      ) : (
        <div>
          <h1>Welcome</h1>
          <p>Please login to continue</p>
          <Link to="/login">Login</Link>
        </div>
      )}
    </div>
  );
}
```

## 🎭 Validación de Permisos

### Verificar Permiso Específico

```tsx
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

function FarmActions() {
  const { permissions } = useAuth();

  return (
    <div className="flex gap-2">
      {permissions.canCreateFarms && (
        <Button onClick={createFarm}>
          Create Farm
        </Button>
      )}
      
      {permissions.canEditFarms && (
        <Button onClick={editFarm}>
          Edit Farm
        </Button>
      )}
      
      {permissions.canDeleteFarms && (
        <Button variant="destructive" onClick={deleteFarm}>
          Delete Farm
        </Button>
      )}
    </div>
  );
}
```

### Componente por Rol

```tsx
import { useAuth } from '@/hooks/useAuth';

function RoleBasedComponent() {
  const { profile } = useAuth();

  if (profile?.role === 'admin') {
    return <AdminDashboard />;
  }

  if (profile?.role === 'manager') {
    return <ManagerDashboard />;
  }

  if (profile?.role === 'operator') {
    return <OperatorDashboard />;
  }

  return <ViewerDashboard />;
}
```

### Hook Personalizado para Permisos

```tsx
import { useAuth } from '@/hooks/useAuth';

function usePermission(permission: keyof UserPermissions) {
  const { permissions } = useAuth();
  return permissions[permission];
}

// Uso
function MyComponent() {
  const canDelete = usePermission('canDeleteFarms');

  return (
    <div>
      {canDelete && (
        <Button variant="destructive">Delete</Button>
      )}
    </div>
  );
}
```

## 👤 Gestión de Perfil

### Actualizar Perfil

```tsx
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

function UpdateProfileForm() {
  const { profile, updateProfile } = useAuth();
  const [name, setName] = useState(profile?.full_name || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await updateProfile({
      full_name: name,
    });

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated successfully!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
      />
      <button type="submit">Save</button>
    </form>
  );
}
```

### Cambiar Preferencias

```tsx
import { useAuth } from '@/hooks/useAuth';

function ThemeSelector() {
  const { profile, updateProfile } = useAuth();

  const changeTheme = async (theme: 'light' | 'dark' | 'system') => {
    await updateProfile({
      preferences: {
        ...profile!.preferences,
        theme,
      },
    });
  };

  return (
    <div>
      <button onClick={() => changeTheme('light')}>Light</button>
      <button onClick={() => changeTheme('dark')}>Dark</button>
      <button onClick={() => changeTheme('system')}>System</button>
    </div>
  );
}
```

### Actualizar Notificaciones

```tsx
import { useAuth } from '@/hooks/useAuth';
import { Switch } from '@/components/ui/switch';

function NotificationSettings() {
  const { profile, updateProfile } = useAuth();

  const toggleNotification = async (
    type: 'email' | 'push' | 'sms',
    enabled: boolean
  ) => {
    await updateProfile({
      preferences: {
        ...profile!.preferences,
        notifications: {
          ...profile!.preferences.notifications,
          [type]: enabled,
        },
      },
    });
  };

  return (
    <div>
      <div>
        <label>Email Notifications</label>
        <Switch
          checked={profile?.preferences.notifications.email}
          onCheckedChange={(checked) => toggleNotification('email', checked)}
        />
      </div>
      
      <div>
        <label>Push Notifications</label>
        <Switch
          checked={profile?.preferences.notifications.push}
          onCheckedChange={(checked) => toggleNotification('push', checked)}
        />
      </div>
    </div>
  );
}
```

## 🎯 Onboarding Personalizado

### Verificar Estado del Onboarding

```tsx
import { useAuth } from '@/hooks/useAuth';

function OnboardingStatus() {
  const { profile } = useAuth();

  return (
    <div>
      <p>Completed: {profile?.onboarding.completed ? 'Yes' : 'No'}</p>
      <p>Current Step: {profile?.onboarding.currentStep}</p>
      <p>Skipped: {profile?.onboarding.skipped ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

### Reiniciar Onboarding

```tsx
import { useAuth } from '@/hooks/useAuth';

function ResetOnboardingButton() {
  const { updateProfile } = useAuth();

  const resetOnboarding = async () => {
    await updateProfile({
      onboarding: {
        completed: false,
        currentStep: 0,
        completedSteps: [],
        skipped: false,
      },
    });
    
    // Recargar la página para mostrar el onboarding
    window.location.reload();
  };

  return (
    <button onClick={resetOnboarding}>
      Reset Onboarding
    </button>
  );
}
```

### Completar Onboarding Manualmente

```tsx
import { useAuth } from '@/hooks/useAuth';

function CompleteOnboardingButton() {
  const { updateProfile } = useAuth();

  const completeOnboarding = async () => {
    await updateProfile({
      onboarding: {
        completed: true,
        currentStep: 4,
        completedSteps: ['welcome', 'profile', 'features', 'setup'],
        skipped: false,
      },
    });
  };

  return (
    <button onClick={completeOnboarding}>
      Complete Onboarding
    </button>
  );
}
```

## 🎨 Componentes UI Personalizados

### Badge de Rol Personalizado

```tsx
import { RoleBadge } from '@/components/auth/RoleBadge';
import { useAuth } from '@/hooks/useAuth';

function UserRoleBadge() {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div>
      <h3>Your Role</h3>
      <RoleBadge role={profile.role} showTooltip={true} />
    </div>
  );
}
```

### Avatar de Usuario

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

function UserAvatar() {
  const { profile } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Avatar>
      <AvatarImage src={profile?.avatar_url} />
      <AvatarFallback>
        {getInitials(profile?.full_name)}
      </AvatarFallback>
    </Avatar>
  );
}
```

## 🔄 Integración con Formularios

### Formulario de Login Completo

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { PasswordInput } from '@/components/auth/PasswordInput';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const { signIn } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const { error } = await signIn(data.email, data.password);
    if (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input {...register('email')} type="email" />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label>Password</label>
        <PasswordInput {...register('password')} />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <button type="submit">Login</button>
    </form>
  );
}
```

## 🚀 Casos de Uso Avanzados

### Redirección Condicional

```tsx
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function ConditionalRedirect() {
  const { profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (profile?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  }, [isAuthenticated, profile, navigate]);

  return <div>Redirecting...</div>;
}
```

### Componente de Carga con Autenticación

```tsx
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

function AuthenticatedPage() {
  const { isLoading, isAuthenticated, profile } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Welcome, {profile?.full_name}!</h1>
      {/* Your content here */}
    </div>
  );
}
```

### Hook Personalizado para Verificar Rol

```tsx
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user';

function useHasRole(role: UserRole) {
  const { profile } = useAuth();
  return profile?.role === role;
}

// Uso
function AdminOnlyComponent() {
  const isAdmin = useHasRole('admin');

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return <div>Admin Panel</div>;
}
```

## 📝 Notas Importantes

### Manejo de Errores

Siempre maneja los errores de autenticación:

```tsx
const { error } = await signIn(email, password);

if (error) {
  // Mostrar mensaje de error al usuario
  toast.error(error.message);
  // Log para debugging
  console.error('Auth error:', error);
}
```

### Actualización del Estado

El hook `useAuth` se actualiza automáticamente cuando cambia el estado de autenticación. No necesitas recargar manualmente.

### Persistencia

Las sesiones se persisten automáticamente en localStorage. El usuario permanecerá autenticado incluso después de cerrar el navegador.

---

**¿Necesitas más ejemplos?**
Consulta los archivos de componentes en `src/components/auth/` y `src/pages/` para ver implementaciones completas.
