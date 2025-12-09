import { motion } from 'framer-motion';
import { Map, BarChart3, MessageSquare, FileText, Bell, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const OnboardingStep3 = () => {
    const features = [
        {
            icon: Map,
            title: 'Interactive Maps',
            description: 'Visualize your farms, parcels, and paddocks with detailed mapping',
            demo: '🗺️',
        },
        {
            icon: BarChart3,
            title: 'Analytics Dashboard',
            description: 'Track performance metrics and trends with real-time data',
            demo: '📊',
        },
        {
            icon: MessageSquare,
            title: 'AI Assistant',
            description: 'Get instant recommendations and answers to your questions',
            demo: '💬',
        },
        {
            icon: Bell,
            title: 'Smart Alerts',
            description: 'Receive notifications about important events and risks',
            demo: '🔔',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Powerful Features at Your Fingertips</h3>
                <p className="text-muted-foreground">
                    Explore what makes AgriVibe the complete solution for modern farming
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="p-4 hover:shadow-lg transition-all cursor-pointer group">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <feature.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-sm">{feature.title}</h4>
                                        <span className="text-2xl">{feature.demo}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <p className="text-sm text-center">
                    <span className="font-semibold">Pro Tip:</span> Use the interactive tour anytime by clicking
                    the help icon in the dashboard
                </p>
            </div>
        </div>
    );
};
