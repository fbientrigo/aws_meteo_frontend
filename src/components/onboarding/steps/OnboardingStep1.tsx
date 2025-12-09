import { motion } from 'framer-motion';
import { Sprout, TrendingUp, Shield, Zap } from 'lucide-react';

export const OnboardingStep1 = () => {
    const features = [
        {
            icon: Sprout,
            title: 'Smart Monitoring',
            description: 'Track your crops and fields in real-time',
            color: 'text-green-500',
        },
        {
            icon: TrendingUp,
            title: 'Data Analytics',
            description: 'Make informed decisions with AI insights',
            color: 'text-blue-500',
        },
        {
            icon: Shield,
            title: 'Risk Management',
            description: 'Identify and mitigate potential threats',
            color: 'text-orange-500',
        },
        {
            icon: Zap,
            title: 'Automation',
            description: 'Streamline your agricultural operations',
            color: 'text-purple-500',
        },
    ];

    return (
        <div className="space-y-8">
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="inline-block mb-4"
                >
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sprout className="h-12 w-12 text-primary" />
                    </div>
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">Welcome to the Future of Farming</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    AgriVibe combines cutting-edge technology with agricultural expertise to help you
                    maximize productivity and sustainability.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                    >
                        <feature.icon className={`h-8 w-8 mb-3 ${feature.color}`} />
                        <h4 className="font-semibold mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
