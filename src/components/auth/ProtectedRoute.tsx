import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading, profile } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Redirect to onboarding for new users (only if not already on onboarding page)
    if (profile && !profile.onboarding.completed && !profile.onboarding.skipped && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }

    return <>{children}</>;
};
