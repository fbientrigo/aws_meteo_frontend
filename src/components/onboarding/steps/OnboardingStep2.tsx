import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Building2, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const profileSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    company: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const OnboardingStep2 = () => {
    const { profile, updateProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: profile?.full_name || '',
            company: profile?.company || '',
            phone: profile?.phone || '',
        },
    });

    // Auto-save form data
    useEffect(() => {
        const subscription = watch((value) => {
            if (value.full_name || value.company || value.phone || value.location) {
                const timer = setTimeout(() => {
                    updateProfile({
                        full_name: value.full_name,
                        company: value.company,
                        phone: value.phone,
                        // location is not in UserProfile interface in the mock, but assuming it might be added or ignored
                    });
                }, 500); // Debounce 500ms
                return () => clearTimeout(timer);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, updateProfile]);

    const onSubmit = async (data: ProfileFormData) => {
        setIsLoading(true);
        try {
            await updateProfile({
                full_name: data.full_name,
                company: data.company,
                phone: data.phone,
            });
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="text-center mb-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mx-auto mb-2">
                    <User className="h-7 w-7 text-white" />
                </div>
                <p className="text-muted-foreground text-xs">
                    Help us personalize your experience
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
                <div className="space-y-1">
                    <Label htmlFor="full_name" className="text-xs">Full Name *</Label>
                    <div className="relative">
                        <User className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            id="full_name"
                            placeholder="John Doe"
                            className="pl-9 h-8 text-sm"
                            {...register('full_name')}
                        />
                    </div>
                    {errors.full_name && (
                        <p className="text-[10px] text-destructive">{errors.full_name.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="company" className="text-xs">Company / Farm Name</Label>
                    <div className="relative">
                        <Building2 className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            id="company"
                            placeholder="Green Valley Farms"
                            className="pl-9 h-8 text-sm"
                            {...register('company')}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="phone" className="text-xs">Phone Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            className="pl-9 h-8 text-sm"
                            {...register('phone')}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="location" className="text-xs">Location</Label>
                    <div className="relative">
                        <MapPin className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            id="location"
                            placeholder="California, USA"
                            className="pl-9 h-8 text-sm"
                            {...register('location')}
                        />
                    </div>
                </div>
            </form>

            <div className="pt-2 border-t">
                <p className="text-[10px] text-muted-foreground text-center">
                    Update anytime from profile settings
                </p>
            </div>
        </div>
    );
};
