import { supabase } from "@/integrations/supabase/client";
import { AuthError, Session, User } from "@supabase/supabase-js";
import { FarmData, RiskData, Message } from "@/types";
import { getMockFarms, getMockRisks, getMockSolutions } from "@/data/mockData";

// --- Interfaces ---

export interface AuthResponse {
    user: User | null;
    session: Session | null;
    error: AuthError | null;
}

export interface ChatResponse {
    message: string;
    solution?: {
        title: string;
        description: string;
        metrics: { label: string; value: string }[];
    };
}

export interface ApiService {
    auth: {
        signIn: (email: string, password: string) => Promise<AuthResponse>;
        signUp: (email: string, password: string) => Promise<AuthResponse>;
        signOut: () => Promise<{ error: AuthError | null }>;
        getSession: () => Promise<{ session: Session | null; error: AuthError | null }>;
        onAuthStateChange: (callback: (event: string, session: Session | null) => void) => { data: { subscription: { unsubscribe: () => void } } };
    };
    data: {
        getFarms: () => Promise<FarmData[]>;
        getRisks: () => Promise<RiskData[]>;
        chat: (message: string) => Promise<ChatResponse>;
        getSolutions: () => Promise<import('@/types').Solution[]>;
    };
}

// --- Supabase Implementation ---

const supabaseService: ApiService = {
    auth: {
        signIn: async (email, password) => {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            return { user: data.user, session: data.session, error };
        },
        signUp: async (email, password) => {
            const { data, error } = await supabase.auth.signUp({ email, password });
            return { user: data.user, session: data.session, error };
        },
        signOut: async () => {
            const { error } = await supabase.auth.signOut();
            return { error };
        },
        getSession: async () => {
            const { data, error } = await supabase.auth.getSession();
            return { session: data.session, error };
        },
        onAuthStateChange: (callback) => {
            return supabase.auth.onAuthStateChange(callback);
        }
    },
    data: {
        getFarms: async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            // In the future: const { data } = await supabase.from('farms').select('*');
            return getMockFarms();
        },
        getRisks: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return getMockRisks();
        },
        chat: async (message) => {
            await new Promise(resolve => setTimeout(resolve, 1500));
            return {
                message: "Based on your farm's conditions, here are my recommendations:",
                solution: {
                    title: "Drought Mitigation Strategy",
                    description: "Implement a comprehensive water management system with smart irrigation technology.",
                    metrics: [
                        { label: "Water Savings", value: "40%" },
                        { label: "Cost Reduction", value: "$12k/year" },
                        { label: "Implementation", value: "3 months" },
                        { label: "ROI", value: "18 months" },
                    ],
                },
            };
        },
        getSolutions: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return getMockSolutions();
        }
    }
};

// --- Mock Implementation ---

const mockApiService: ApiService = {
    auth: {
        signIn: async (email, password) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (email && password) {
                const user: User = {
                    id: 'mock-user-id',
                    aud: 'authenticated',
                    role: 'authenticated',
                    email: email,
                    email_confirmed_at: new Date().toISOString(),
                    phone: '',
                    confirmed_at: new Date().toISOString(),
                    last_sign_in_at: new Date().toISOString(),
                    app_metadata: { provider: 'email', providers: ['email'] },
                    user_metadata: {},
                    identities: [],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                const session: Session = {
                    access_token: 'mock-access-token',
                    token_type: 'bearer',
                    expires_in: 3600,
                    refresh_token: 'mock-refresh-token',
                    user: user,
                };
                localStorage.setItem('mock-session', JSON.stringify(session));
                return { user, session, error: null };
            }
            return { user: null, session: null, error: { message: 'Invalid credentials', name: 'AuthError', status: 401 } as AuthError };
        },
        signUp: async (email, password) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            // Auto-login after signup for mock
            const user: User = {
                id: 'mock-user-id',
                aud: 'authenticated',
                role: 'authenticated',
                email: email,
                email_confirmed_at: new Date().toISOString(),
                phone: '',
                confirmed_at: new Date().toISOString(),
                last_sign_in_at: new Date().toISOString(),
                app_metadata: { provider: 'email', providers: ['email'] },
                user_metadata: {},
                identities: [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            const session: Session = {
                access_token: 'mock-access-token',
                token_type: 'bearer',
                expires_in: 3600,
                refresh_token: 'mock-refresh-token',
                user: user,
            };
            localStorage.setItem('mock-session', JSON.stringify(session));
            return { user, session, error: null };
        },
        signOut: async () => {
            localStorage.removeItem('mock-session');
            return { error: null };
        },
        getSession: async () => {
            const sessionStr = localStorage.getItem('mock-session');
            if (sessionStr) {
                return { session: JSON.parse(sessionStr), error: null };
            }
            return { session: null, error: null };
        },
        onAuthStateChange: (callback) => {
            // Simple mock subscription
            const sessionStr = localStorage.getItem('mock-session');
            if (sessionStr) {
                callback('SIGNED_IN', JSON.parse(sessionStr));
            }
            return { data: { subscription: { unsubscribe: () => { } } } };
        }
    },
    data: {
        getFarms: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return getMockFarms();
        },
        getRisks: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return getMockRisks();
        },
        chat: async (message) => {
            await new Promise(resolve => setTimeout(resolve, 1500));
            return {
                message: "Based on your farm's conditions, here are my recommendations:",
                solution: {
                    title: "Drought Mitigation Strategy",
                    description: "Implement a comprehensive water management system with smart irrigation technology.",
                    metrics: [
                        { label: "Water Savings", value: "40%" },
                        { label: "Cost Reduction", value: "$12k/year" },
                        { label: "Implementation", value: "3 months" },
                        { label: "ROI", value: "18 months" },
                    ],
                },
            };
        },
        getSolutions: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return getMockSolutions();
        }
    }
};

// --- Export ---

// Using Mock Service to allow development without backend configuration
export const api = mockApiService;
// export const api = supabaseService;
