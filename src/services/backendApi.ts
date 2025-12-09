import { supabase } from "@/integrations/supabase/client";
import { Parcel, PaddockDetailed } from "@/types";
import { UserProfile } from "@/types/user";

// ===========================================
// Configuration
// ===========================================
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const API_URL = import.meta.env.VITE_API_URL || '';

// ===========================================
// Types
// ===========================================
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
}

// ===========================================
// Parcel API
// ===========================================
export const parcelApi = {
    // Get all parcels for current user
    getAll: async (): Promise<ApiResponse<Parcel[]>> => {
        if (USE_MOCK) {
            return { data: [], error: null };
        }

        try {
            const { data, error } = await supabase
                .from('parcels')
                .select(`
                    *,
                    paddocks (*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform to Parcel type
            const parcels: Parcel[] = (data || []).map((p: any) => ({
                id: p.id,
                name: p.name,
                area: p.area || 0,
                geoJSON: p.geojson,
                color: p.color || '#3b82f6',
                paddocks: (p.paddocks || []).map((pad: any) => ({
                    id: pad.id,
                    name: pad.name,
                    area: pad.area || 0,
                    geoJSON: pad.geojson,
                    cropType: pad.crop_type || 'none',
                    irrigationType: pad.irrigation_type || 'none',
                    description: pad.description || '',
                })),
            }));

            return { data: parcels, error: null };
        } catch (err: any) {
            console.error('Error fetching parcels:', err);
            return { data: null, error: err.message };
        }
    },

    // Create a new parcel
    create: async (parcel: Omit<Parcel, 'id' | 'paddocks'>): Promise<ApiResponse<Parcel>> => {
        if (USE_MOCK) {
            const mockParcel: Parcel = {
                ...parcel,
                id: `parcel-${Date.now()}`,
                paddocks: [],
            };
            return { data: mockParcel, error: null };
        }

        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData?.user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('parcels')
                .insert({
                    user_id: userData.user.id,
                    name: parcel.name,
                    area: parcel.area,
                    geojson: parcel.geoJSON,
                    color: parcel.color,
                })
                .select()
                .single();

            if (error) throw error;

            const newParcel: Parcel = {
                id: data.id,
                name: data.name,
                area: data.area,
                geoJSON: data.geojson,
                color: data.color,
                paddocks: [],
            };

            return { data: newParcel, error: null };
        } catch (err: any) {
            console.error('Error creating parcel:', err);
            return { data: null, error: err.message };
        }
    },

    // Update a parcel
    update: async (id: string, updates: Partial<Parcel>): Promise<ApiResponse<Parcel>> => {
        if (USE_MOCK) {
            return { data: null, error: null };
        }

        try {
            const { data, error } = await supabase
                .from('parcels')
                .update({
                    name: updates.name,
                    area: updates.area,
                    geojson: updates.geoJSON,
                    color: updates.color,
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return { data: data as Parcel, error: null };
        } catch (err: any) {
            console.error('Error updating parcel:', err);
            return { data: null, error: err.message };
        }
    },

    // Delete a parcel
    delete: async (id: string): Promise<ApiResponse<boolean>> => {
        if (USE_MOCK) {
            return { data: true, error: null };
        }

        try {
            const { error } = await supabase
                .from('parcels')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { data: true, error: null };
        } catch (err: any) {
            console.error('Error deleting parcel:', err);
            return { data: null, error: err.message };
        }
    },
};

// ===========================================
// Paddock API
// ===========================================
export const paddockApi = {
    // Create a paddock inside a parcel
    create: async (parcelId: string, paddock: Omit<PaddockDetailed, 'id'>): Promise<ApiResponse<PaddockDetailed>> => {
        if (USE_MOCK) {
            const mockPaddock: PaddockDetailed = {
                ...paddock,
                id: `paddock-${Date.now()}`,
            };
            return { data: mockPaddock, error: null };
        }

        try {
            const { data, error } = await supabase
                .from('paddocks')
                .insert({
                    parcel_id: parcelId,
                    name: paddock.name,
                    area: paddock.area,
                    geojson: paddock.geoJSON,
                    crop_type: paddock.cropType,
                    irrigation_type: paddock.irrigationType,
                    description: paddock.description,
                })
                .select()
                .single();

            if (error) throw error;

            const newPaddock: PaddockDetailed = {
                id: data.id,
                name: data.name,
                area: data.area,
                geoJSON: data.geojson,
                cropType: data.crop_type,
                irrigationType: data.irrigation_type,
                description: data.description,
            };

            return { data: newPaddock, error: null };
        } catch (err: any) {
            console.error('Error creating paddock:', err);
            return { data: null, error: err.message };
        }
    },

    // Update a paddock
    update: async (id: string, updates: Partial<PaddockDetailed>): Promise<ApiResponse<PaddockDetailed>> => {
        if (USE_MOCK) {
            return { data: null, error: null };
        }

        try {
            const { data, error } = await supabase
                .from('paddocks')
                .update({
                    name: updates.name,
                    area: updates.area,
                    geojson: updates.geoJSON,
                    crop_type: updates.cropType,
                    irrigation_type: updates.irrigationType,
                    description: updates.description,
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return { data: data as PaddockDetailed, error: null };
        } catch (err: any) {
            console.error('Error updating paddock:', err);
            return { data: null, error: err.message };
        }
    },

    // Delete a paddock
    delete: async (id: string): Promise<ApiResponse<boolean>> => {
        if (USE_MOCK) {
            return { data: true, error: null };
        }

        try {
            const { error } = await supabase
                .from('paddocks')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { data: true, error: null };
        } catch (err: any) {
            console.error('Error deleting paddock:', err);
            return { data: null, error: err.message };
        }
    },
};

// ===========================================
// Profile API
// ===========================================
export const profileApi = {
    // Get user profile
    get: async (userId: string): Promise<ApiResponse<UserProfile>> => {
        if (USE_MOCK) {
            return { data: null, error: null };
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            const profile: UserProfile = {
                id: data.id,
                email: data.email,
                full_name: data.full_name,
                avatar_url: data.avatar_url,
                phone: data.phone,
                company: data.company,
                role: data.role || 'viewer',
                created_at: data.created_at,
                updated_at: data.updated_at,
                preferences: data.preferences || {},
                onboarding: data.onboarding || {
                    completed: false,
                    currentStep: 0,
                    completedSteps: [],
                    skipped: false,
                },
                metadata: data.metadata || {},
            };

            return { data: profile, error: null };
        } catch (err: any) {
            console.error('Error fetching profile:', err);
            return { data: null, error: err.message };
        }
    },

    // Update user profile
    update: async (userId: string, updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
        if (USE_MOCK) {
            return { data: null, error: null };
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    full_name: updates.full_name,
                    phone: updates.phone,
                    company: updates.company,
                    avatar_url: updates.avatar_url,
                    preferences: updates.preferences,
                    onboarding: updates.onboarding,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return { data: data as UserProfile, error: null };
        } catch (err: any) {
            console.error('Error updating profile:', err);
            return { data: null, error: err.message };
        }
    },

    // Create profile (called after signup)
    create: async (userId: string, email: string, fullName?: string): Promise<ApiResponse<UserProfile>> => {
        if (USE_MOCK) {
            return { data: null, error: null };
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    email: email,
                    full_name: fullName || 'User',
                    role: 'viewer',
                    preferences: {
                        theme: 'system',
                        language: 'es',
                        notifications: { email: true, push: true, sms: false },
                    },
                    onboarding: {
                        completed: false,
                        currentStep: 0,
                        completedSteps: [],
                        skipped: false,
                    },
                })
                .select()
                .single();

            if (error) throw error;
            return { data: data as UserProfile, error: null };
        } catch (err: any) {
            console.error('Error creating profile:', err);
            return { data: null, error: err.message };
        }
    },
};

// ===========================================
// Risks API
// ===========================================
export const risksApi = {
    // Get heatmap data for risks
    getHeatmapData: async (riskType: string, bounds?: { north: number; south: number; east: number; west: number }): Promise<ApiResponse<[number, number, number][]>> => {
        if (USE_MOCK) {
            // Return empty for mock - will use existing mock data
            return { data: [], error: null };
        }

        try {
            // This would call your backend API for real climate data
            const response = await fetch(`${API_URL}/risks/heatmap?type=${riskType}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch heatmap data');

            const data = await response.json();
            return { data: data.points, error: null };
        } catch (err: any) {
            console.error('Error fetching heatmap data:', err);
            return { data: null, error: err.message };
        }
    },
};

// ===========================================
// Chat API
// ===========================================
export const chatApi = {
    sendMessage: async (message: string, context?: any): Promise<ApiResponse<{ reply: string; solution?: any }>> => {
        if (USE_MOCK) {
            // Mock AI response
            await new Promise(resolve => setTimeout(resolve, 1000));
            return {
                data: {
                    reply: "Basándome en las condiciones de tu predio, te recomiendo implementar un sistema de riego por goteo para optimizar el uso del agua.",
                    solution: {
                        title: "Sistema de Riego Eficiente",
                        description: "Implementar riego por goteo con sensores de humedad",
                        metrics: [
                            { label: "Ahorro de agua", value: "40%" },
                            { label: "Reducción costos", value: "$8k/año" },
                        ],
                    },
                },
                error: null,
            };
        }

        try {
            const response = await fetch(`${API_URL}/chat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, context }),
            });

            if (!response.ok) throw new Error('Failed to send message');

            const data = await response.json();
            return { data, error: null };
        } catch (err: any) {
            console.error('Error sending chat message:', err);
            return { data: null, error: err.message };
        }
    },
};

// ===========================================
// Export all APIs
// ===========================================
export const backendApi = {
    parcels: parcelApi,
    paddocks: paddockApi,
    profile: profileApi,
    risks: risksApi,
    chat: chatApi,
};
