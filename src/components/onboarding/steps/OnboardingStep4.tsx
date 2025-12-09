import { useState } from 'react';
import { Moon, Sun, Monitor, Globe, Bell, Mail, Smartphone } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';

export const OnboardingStep4 = () => {
    const { profile, updateProfile } = useAuth();
    const [theme, setTheme] = useState(profile?.preferences.theme || 'system');
    const [language, setLanguage] = useState(profile?.preferences.language || 'en');
    const [notifications, setNotifications] = useState(
        profile?.preferences.notifications || {
            email: true,
            push: true,
            sms: false,
        }
    );

    const handleThemeChange = (value: string) => {
        setTheme(value as any);
        updateProfile({
            preferences: {
                ...profile!.preferences,
                theme: value as any,
            },
        });
    };

    const handleLanguageChange = (value: string) => {
        setLanguage(value as any);
        updateProfile({
            preferences: {
                ...profile!.preferences,
                language: value as any,
            },
        });
    };

    const handleNotificationToggle = (key: 'email' | 'push' | 'sms', value: boolean) => {
        const updated = { ...notifications, [key]: value };
        setNotifications(updated);
        updateProfile({
            preferences: {
                ...profile!.preferences,
                notifications: updated,
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Customize Your Experience</h3>
                <p className="text-muted-foreground">
                    Set up your preferences to make AgriVibe work the way you want
                </p>
            </div>


            {/* Language Selection */}
            <Card className="p-4">
                <Label htmlFor="language" className="text-base font-semibold mb-3 block">
                    Language
                </Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                English
                            </div>
                        </SelectItem>
                        <SelectItem value="es">
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Español
                            </div>
                        </SelectItem>
                        <SelectItem value="pt">
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Português
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </Card>

            {/* Notifications */}
            <Card className="p-4">
                <Label className="text-base font-semibold mb-3 block">Notifications</Label>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Email Notifications</p>
                                <p className="text-sm text-muted-foreground">Receive updates via email</p>
                            </div>
                        </div>
                        <Switch
                            checked={notifications.email}
                            onCheckedChange={(checked) => handleNotificationToggle('email', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Push Notifications</p>
                                <p className="text-sm text-muted-foreground">Get browser notifications</p>
                            </div>
                        </div>
                        <Switch
                            checked={notifications.push}
                            onCheckedChange={(checked) => handleNotificationToggle('push', checked)}
                        />
                    </div>
                </div>
            </Card>

            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                <p className="text-sm text-center text-green-700 dark:text-green-400">
                    🎉 You're all set! Click "Complete" to start using AgriVibe
                </p>
            </div>
        </div>
    );
};
