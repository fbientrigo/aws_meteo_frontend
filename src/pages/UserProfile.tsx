import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    User, Mail, Building2, Phone, MapPin, Shield,
    Bell, Globe, Palette, LogOut, Save, Camera,
    ArrowLeft, Settings as SettingsIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const profileSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    company: z.string().optional(),
    phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const UserProfile = () => {
    const navigate = useNavigate();
    const { profile, user, signOut, updateProfile, permissions } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: profile?.full_name || '',
            email: profile?.email || '',
            company: profile?.company || '',
            phone: profile?.phone || '',
        },
    });

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

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
        toast.success('Signed out successfully');
    };

    const getRoleColor = (role: string) => {
        const colors = {
            admin: 'bg-red-500',
            manager: 'bg-blue-500',
            operator: 'bg-green-500',
            viewer: 'bg-gray-500',
        };
        return colors[role as keyof typeof colors] || 'bg-gray-500';
    };

    const getInitials = (name?: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Header */}
            <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/dashboard')}
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleSignOut}
                            className="gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Profile Header */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            <div className="relative group">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                    <AvatarImage src={profile.avatar_url} />
                                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/50 text-white">
                                        {getInitials(profile.full_name)}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Camera className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                    <h1 className="text-3xl font-bold">{profile.full_name || 'User'}</h1>
                                    <Badge className={`${getRoleColor(profile.role)} text-white w-fit mx-auto md:mx-0`}>
                                        {profile.role.toUpperCase()}
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground mb-4">{profile.email}</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div className="text-center md:text-left">
                                        <p className="text-muted-foreground">Member Since</p>
                                        <p className="font-semibold">
                                            {new Date(profile.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <p className="text-muted-foreground">Last Login</p>
                                        <p className="font-semibold">
                                            {profile.metadata?.lastLogin
                                                ? new Date(profile.metadata.lastLogin).toLocaleDateString()
                                                : 'Today'}
                                        </p>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <p className="text-muted-foreground">Total Farms</p>
                                        <p className="font-semibold">{profile.metadata?.farmCount || 0}</p>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <p className="text-muted-foreground">Login Count</p>
                                        <p className="font-semibold">{profile.metadata?.loginCount || 1}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="profile" className="gap-2">
                            <User className="h-4 w-4" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="preferences" className="gap-2">
                            <SettingsIcon className="h-4 w-4" />
                            Preferences
                        </TabsTrigger>
                        <TabsTrigger value="security" className="gap-2">
                            <Shield className="h-4 w-4" />
                            Security
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>
                                    Update your personal details and contact information
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="full_name">Full Name *</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="full_name"
                                                    placeholder="John Doe"
                                                    className="pl-10"
                                                    {...register('full_name')}
                                                />
                                            </div>
                                            {errors.full_name && (
                                                <p className="text-sm text-destructive">{errors.full_name.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email *</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    className="pl-10"
                                                    disabled
                                                    {...register('email')}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Email cannot be changed
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="company">Company / Farm Name</Label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="company"
                                                    placeholder="Green Valley Farms"
                                                    className="pl-10"
                                                    {...register('company')}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="+1 (555) 123-4567"
                                                    className="pl-10"
                                                    {...register('phone')}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-end gap-2">
                                        <Button type="submit" disabled={isLoading} className="gap-2">
                                            <Save className="h-4 w-4" />
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Preferences Tab */}
                    <TabsContent value="preferences">
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Palette className="h-5 w-5" />
                                        Appearance
                                    </CardTitle>
                                    <CardDescription>Customize how AgriVibe looks</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Theme</Label>
                                        <Select
                                            value={profile.preferences.theme}
                                            onValueChange={(value) =>
                                                updateProfile({
                                                    preferences: {
                                                        ...profile.preferences,
                                                        theme: value as any,
                                                    },
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="light">Light</SelectItem>
                                                <SelectItem value="dark">Dark</SelectItem>
                                                <SelectItem value="system">System</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="h-5 w-5" />
                                        Language & Region
                                    </CardTitle>
                                    <CardDescription>Set your language preferences</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Language</Label>
                                        <Select
                                            value={profile.preferences.language}
                                            onValueChange={(value) =>
                                                updateProfile({
                                                    preferences: {
                                                        ...profile.preferences,
                                                        language: value as any,
                                                    },
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="es">Español</SelectItem>
                                                <SelectItem value="pt">Português</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="h-5 w-5" />
                                        Notifications
                                    </CardTitle>
                                    <CardDescription>Manage how you receive updates</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Email Notifications</p>
                                            <p className="text-sm text-muted-foreground">
                                                Receive updates via email
                                            </p>
                                        </div>
                                        <Switch
                                            checked={profile.preferences.notifications.email}
                                            onCheckedChange={(checked) =>
                                                updateProfile({
                                                    preferences: {
                                                        ...profile.preferences,
                                                        notifications: {
                                                            ...profile.preferences.notifications,
                                                            email: checked,
                                                        },
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Push Notifications</p>
                                            <p className="text-sm text-muted-foreground">
                                                Get browser notifications
                                            </p>
                                        </div>
                                        <Switch
                                            checked={profile.preferences.notifications.push}
                                            onCheckedChange={(checked) =>
                                                updateProfile({
                                                    preferences: {
                                                        ...profile.preferences,
                                                        notifications: {
                                                            ...profile.preferences.notifications,
                                                            push: checked,
                                                        },
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">SMS Alerts</p>
                                            <p className="text-sm text-muted-foreground">
                                                Critical alerts via SMS
                                            </p>
                                        </div>
                                        <Switch
                                            checked={profile.preferences.notifications.sms}
                                            onCheckedChange={(checked) =>
                                                updateProfile({
                                                    preferences: {
                                                        ...profile.preferences,
                                                        notifications: {
                                                            ...profile.preferences.notifications,
                                                            sms: checked,
                                                        },
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security">
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Permissions</CardTitle>
                                    <CardDescription>
                                        Your current role and permissions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <span>Create Farms</span>
                                            <Badge variant={permissions.canCreateFarms ? 'default' : 'secondary'}>
                                                {permissions.canCreateFarms ? 'Allowed' : 'Denied'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <span>Edit Farms</span>
                                            <Badge variant={permissions.canEditFarms ? 'default' : 'secondary'}>
                                                {permissions.canEditFarms ? 'Allowed' : 'Denied'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <span>Delete Farms</span>
                                            <Badge variant={permissions.canDeleteFarms ? 'default' : 'secondary'}>
                                                {permissions.canDeleteFarms ? 'Allowed' : 'Denied'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <span>Manage Users</span>
                                            <Badge variant={permissions.canManageUsers ? 'default' : 'secondary'}>
                                                {permissions.canManageUsers ? 'Allowed' : 'Denied'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <span>Export Data</span>
                                            <Badge variant={permissions.canExportData ? 'default' : 'secondary'}>
                                                {permissions.canExportData ? 'Allowed' : 'Denied'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Password</CardTitle>
                                    <CardDescription>Change your password</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="outline" className="w-full">
                                        Change Password
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border-destructive">
                                <CardHeader>
                                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                                    <CardDescription>
                                        Irreversible actions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="destructive" className="w-full">
                                        Delete Account
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default UserProfile;
