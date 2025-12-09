export type UserRole = 'admin' | 'manager' | 'operator' | 'viewer';

export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    phone?: string;
    company?: string;
    role: UserRole;
    created_at: string;
    updated_at: string;

    // Preferences
    preferences: {
        theme: 'light' | 'dark' | 'system';
        language: 'en' | 'es' | 'pt';
        notifications: {
            email: boolean;
            push: boolean;
            sms: boolean;
        };
        defaultFarmId?: string;
    };

    // Onboarding
    onboarding: {
        completed: boolean;
        currentStep: number;
        completedSteps: string[];
        skipped: boolean;
    };

    // Metadata
    metadata?: {
        lastLogin?: string;
        loginCount?: number;
        farmCount?: number;
        [key: string]: any;
    };
}

export interface UserPermissions {
    canCreateFarms: boolean;
    canEditFarms: boolean;
    canDeleteFarms: boolean;
    canManageUsers: boolean;
    canViewReports: boolean;
    canExportData: boolean;
    canManageSettings: boolean;
}

export const rolePermissions: Record<UserRole, UserPermissions> = {
    admin: {
        canCreateFarms: true,
        canEditFarms: true,
        canDeleteFarms: true,
        canManageUsers: true,
        canViewReports: true,
        canExportData: true,
        canManageSettings: true,
    },
    manager: {
        canCreateFarms: true,
        canEditFarms: true,
        canDeleteFarms: false,
        canManageUsers: false,
        canViewReports: true,
        canExportData: true,
        canManageSettings: false,
    },
    operator: {
        canCreateFarms: false,
        canEditFarms: true,
        canDeleteFarms: false,
        canManageUsers: false,
        canViewReports: true,
        canExportData: false,
        canManageSettings: false,
    },
    viewer: {
        canCreateFarms: false,
        canEditFarms: false,
        canDeleteFarms: false,
        canManageUsers: false,
        canViewReports: true,
        canExportData: false,
        canManageSettings: false,
    },
};
