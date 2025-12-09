import { Loader2 } from "lucide-react";

interface LoadingStateProps {
    message?: string;
    size?: "sm" | "md" | "lg";
}

export const LoadingState = ({ message = "Cargando...", size = "md" }: LoadingStateProps) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12"
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mb-3`} />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
};
