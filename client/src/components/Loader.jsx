import { motion } from 'framer-motion';

export const Spinner = ({ size = 'md' }) => {
  const s = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return <div className="flex justify-center"><motion.div className={`${s[size]} border-[3px] border-baby-pink/30 border-t-brand-warm rounded-full`} animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} /></div>;
};

export const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-cream-light">
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
      <img src="/logo.jpeg" alt="Logo" className="w-14 h-14 rounded-2xl object-contain shadow-soft animate-float" />
      <Spinner />
      <p className="text-sm text-brand-muted font-inter">Creating something magical...</p>
    </motion.div>
  </div>
);

export const SkeletonCard = () => (
  <div className="card p-4 space-y-4 animate-pulse">
    <div className="skeleton aspect-square w-full" />
    <div className="space-y-2"><div className="skeleton h-3 w-1/3" /><div className="skeleton h-4 w-3/4" /><div className="skeleton h-3 w-full" /><div className="flex justify-between pt-2"><div className="skeleton h-5 w-16" /><div className="skeleton h-8 w-8 rounded-xl" /></div></div>
  </div>
);

export const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(count)].map((_, i) => <SkeletonCard key={i} />)}
  </div>
);
