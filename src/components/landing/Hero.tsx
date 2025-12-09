import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Satellite, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const navigate = useNavigate();

  const handleScrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center"
          >
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-bold text-foreground">SbnAI</h2>
                <p className="text-sm text-muted-foreground">Agricultural Intelligence</p>
              </div>
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20"
          >
            <Satellite className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">Advanced Agricultural Monitoring Technology</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
          >
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow-pulse">
              Agricultural Intelligence
            </span>
            <br />
            <span className="text-foreground">in Real Time</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Monitor risks, optimize crops and make data-driven decisions 
            with our AI-powered predictive analysis platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Button
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 px-8"
            >
              View Platform
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleScrollToFeatures}
              className="border-primary/20 hover:bg-primary/5 hover:border-primary text-foreground"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
