import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Enhanced glow effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, hsl(142 76% 36% / 0.08), transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            <span className="text-foreground">Ready to optimize </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              your farm management?
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Join the farmers who are already using artificial intelligence 
            to make better decisions and maximize their yields.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              Access Platform
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
