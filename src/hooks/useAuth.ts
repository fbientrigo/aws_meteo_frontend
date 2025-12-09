import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { api } from '@/services/api';
import { UserProfile, UserPermissions, rolePermissions } from '@/types/user';

interface UseAuthReturn {
    user: User | null;
    profile: UserProfile | null;
    permissions: UserPermissions;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
    refreshProfile: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const permissions: UserPermissions = profile
        ? rolePermissions[profile.role]
        : rolePermissions.viewer;

    const loadProfile = useCallback(async (userId: string, currentUser?: User) => {
        try {
            // In a real app, fetch from Supabase
            // const { data, error } = await supabase
            //   .from('profiles')
            //   .select('*')
            //   .eq('id', userId)
            //   .single();

            // Mock profile for development
            const mockProfile: UserProfile = {
                id: userId,
                email: currentUser?.email || '',
                full_name: currentUser?.user_metadata?.full_name || 'User',
                avatar_url: currentUser?.user_metadata?.avatar_url,
                phone: currentUser?.user_metadata?.phone,
                company: currentUser?.user_metadata?.company,
                role: (currentUser?.user_metadata?.role as any) || 'manager',
                created_at: currentUser?.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString(),
                preferences: {
                    theme: 'system',
                    language: 'en',
                    notifications: {
                        email: true,
                        push: true,
                        sms: false,
                    },
                },
                onboarding: {
                    completed: localStorage.getItem('onboarding_completed') === 'true',
                    currentStep: parseInt(localStorage.getItem('onboarding_step') || '0'),
                    completedSteps: JSON.parse(localStorage.getItem('onboarding_completed_steps') || '[]'),
                    skipped: localStorage.getItem('onboarding_skipped') === 'true',
                },
                metadata: {
                    lastLogin: new Date().toISOString(),
                    loginCount: 1,
                    farmCount: 0,
                },
            };

            setProfile(mockProfile);
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }, []);

    const refreshProfile = useCallback(async () => {
        if (user) {
            await loadProfile(user.id, user);
        }
    }, [user, loadProfile]);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const { session: currentSession } = await api.auth.getSession();

                if (currentSession?.user) {
                    setUser(currentSession.user);
                    setSession(currentSession);
                    await loadProfile(currentSession.user.id, currentSession.user);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        const { data: { subscription } } = api.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user || null);

                if (session?.user) {
                    await loadProfile(session.user.id, session.user);
                } else {
                    setProfile(null);
                }

                setIsLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [loadProfile]);

    const signIn = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { error, user: authUser, session: authSession } = await api.auth.signIn(email, password);

            if (error) {
                return { error };
            }

            if (authUser && authSession) {
                setUser(authUser);
                setSession(authSession);
                await loadProfile(authUser.id, authUser);
            }

            return { error: null };
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (email: string, password: string, fullName?: string) => {
        setIsLoading(true);
        try {
            const { error, user: authUser, session: authSession } = await api.auth.signUp(email, password);

            if (error) {
                return { error };
            }

            // Create profile in database
            if (authUser && authSession) {
                setUser(authUser);
                setSession(authSession);

                // In real app: create profile in Supabase
                // await supabase.from('profiles').insert({
                //   id: authUser.id,
                //   email,
                //   full_name: fullName,
                //   role: 'viewer',
                // });

                await loadProfile(authUser.id, authUser);
            }

            return { error: null };
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        setIsLoading(true);
        try {
            await api.auth.signOut();
            setUser(null);
            setProfile(null);
            setSession(null);

            // Clear onboarding data
            localStorage.removeItem('onboarding_completed');
            localStorage.removeItem('onboarding_step');
            localStorage.removeItem('onboarding_completed_steps');
            localStorage.removeItem('onboarding_skipped');
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!profile) {
            return { error: new Error('No profile loaded') };
        }

        try {
            // In real app: update in Supabase
            // const { error } = await supabase
            //   .from('profiles')
            //   .update(updates)
            //   .eq('id', profile.id);

            // Mock update
            const updatedProfile = { ...profile, ...updates };
            setProfile(updatedProfile);

            // Save onboarding state to localStorage
            if (updates.onboarding) {
                localStorage.setItem('onboarding_completed', String(updates.onboarding.completed));
                localStorage.setItem('onboarding_step', String(updates.onboarding.currentStep));
                localStorage.setItem('onboarding_completed_steps', JSON.stringify(updates.onboarding.completedSteps));
                localStorage.setItem('onboarding_skipped', String(updates.onboarding.skipped));
            }

            return { error: null };
        } catch (error) {
            return { error };
        }
    };

    return {
        user,
        profile,
        permissions,
        session,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshProfile,
    };
};
