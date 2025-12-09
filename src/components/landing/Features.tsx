import { motion } from 'framer-motion';
import { Satellite, Sprout, TrendingUp, Map } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Satellite,
    title: 'Real-Time Monitoring',
    description: 'Detect and analyze agricultural risks like droughts, floods and frosts with constantly updated satellite data.',
  },
  {
    icon: Sprout,
    title: 'Intelligent Crop Management',
    description: 'Optimize your crop performance with personalized recommendations based on historical and current data analysis.',
  },
  {
    icon: TrendingUp,
    title: 'AI Predictive Analysis',
    description: 'Anticipate problems before they occur with machine learning models that predict risks and trends.',
  },
  {
    icon: Map,
    title: 'Geospatial Visualization',
    description: 'Explore your land with advanced interactive maps showing risk data, crops and real-time metrics.',
  },
];

export const Features = () => {
  return (
    <section id="features" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-foreground">Cutting-Edge </span>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Technology
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional tools for modern agricultural management
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group relative h-full p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-105">
                <div className="space-y-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
