export const AnimatedGrid = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(142 76% 36% / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(142 76% 36% / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Glow orbs */}
      <div 
        className="absolute top-0 -left-1/4 w-[500px] h-[500px] rounded-full animate-float"
        style={{
          background: 'radial-gradient(circle, hsl(142 76% 36% / 0.08), transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div 
        className="absolute top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full animate-float"
        style={{
          background: 'radial-gradient(circle, hsl(158 64% 52% / 0.06), transparent 70%)',
          filter: 'blur(80px)',
          animationDelay: '2s',
        }}
      />
      <div 
        className="absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full animate-float"
        style={{
          background: 'radial-gradient(circle, hsl(142 76% 36% / 0.05), transparent 70%)',
          filter: 'blur(70px)',
          animationDelay: '4s',
        }}
      />
    </div>
  );
};
