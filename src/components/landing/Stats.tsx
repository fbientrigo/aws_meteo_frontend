import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface StatProps {
  end: number;
  suffix: string;
  label: string;
  delay?: number;
}

const AnimatedStat = ({ end, suffix, label, delay = 0 }: StatProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = end / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {count.toLocaleString()}{suffix}
        </span>
      </div>
      <div className="text-muted-foreground text-lg">{label}</div>
    </motion.div>
  );
};

export const Stats = () => {
  const stats = [
    { end: 10000, suffix: '+', label: 'Hectares Monitored' },
    { end: 98, suffix: '%', label: 'Prediction Accuracy' },
    { end: 5, suffix: '', label: 'Risk Types Detected' },
    { end: 24, suffix: '/7', label: 'Continuous Monitoring' },
  ];

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-foreground">Proven </span>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Results
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <AnimatedStat
              key={stat.label}
              {...stat}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
