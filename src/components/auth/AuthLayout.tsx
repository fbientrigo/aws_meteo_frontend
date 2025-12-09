import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl font-bold tracking-tighter">{title}</h1>
                        <p className="text-muted-foreground">{subtitle}</p>
                    </div>
                    {children}
                </motion.div>
            </div>

            {/* Right Side - Visuals */}
            <div className="hidden lg:block relative bg-muted overflow-hidden">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white p-8 max-w-lg z-10">
                        <h2 className="text-4xl font-bold mb-4">Advanced Agricultural Intelligence</h2>
                        <p className="text-lg text-zinc-300">Monitor, analyze, and optimize your crops with satellite data and AI-driven insights.</p>
                    </div>
                </div>

                {/* Abstract Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
            </div>
        </div>
    );
};
