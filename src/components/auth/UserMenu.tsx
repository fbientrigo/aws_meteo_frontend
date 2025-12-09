import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Shield, HelpCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const UserMenu = () => {
    const navigate = useNavigate();
    const { profile, user, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
        toast.success('Signed out successfully');
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

    const getRoleColor = (role: string) => {
        const colors = {
            admin: 'bg-red-500',
            manager: 'bg-blue-500',
            operator: 'bg-green-500',
            viewer: 'bg-gray-500',
        };
        return colors[role as keyof typeof colors] || 'bg-gray-500';
    };

    if (!profile) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
                    <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={profile.avatar_url} />
                        <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-primary to-primary/50 text-white">
                            {getInitials(profile.full_name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-medium leading-none">{profile.full_name || 'User'}</p>
                        <p className="text-xs text-muted-foreground mt-1">{profile.email}</p>
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm font-medium">{profile.full_name || 'User'}</p>
                        <p className="text-xs text-muted-foreground">{profile.email}</p>
                        <Badge className={`${getRoleColor(profile.role)} text-white w-fit`}>
                            {profile.role.toUpperCase()}
                        </Badge>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Privacy & Security</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
