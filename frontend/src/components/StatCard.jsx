import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const colorMap = {
  violet: {
    icon: 'bg-primary/20 text-primary border-primary/20',
    glow: 'hover:shadow-[0_0_30px_-8px_rgba(82,39,255,0.38)]',
    bar: 'from-primary to-[#7c65ff]'
  },
  blue: {
    icon: 'bg-blue-600/20 text-blue-400 border-blue-600/20',
    glow: 'hover:shadow-[0_0_30px_-8px_rgba(59,130,246,0.3)]',
    bar: 'from-blue-600 to-cyan-500'
  },
  emerald: {
    icon: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/20',
    glow: 'hover:shadow-[0_0_30px_-8px_rgba(16,185,129,0.3)]',
    bar: 'from-emerald-600 to-teal-500'
  },
  orange: {
    icon: 'bg-orange-600/20 text-orange-400 border-orange-600/20',
    glow: 'hover:shadow-[0_0_30px_-8px_rgba(249,115,22,0.3)]',
    bar: 'from-orange-600 to-amber-500'
  },
  pink: {
    icon: 'bg-pink-600/20 text-pink-400 border-pink-600/20',
    glow: 'hover:shadow-[0_0_30px_-8px_rgba(236,72,153,0.3)]',
    bar: 'from-pink-600 to-rose-500'
  }
};

export const StatCard = ({ title, value, icon: Icon, color = 'violet', subtitle, trend }) => {
  const c = colorMap[color] || colorMap.violet;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-card p-5',
        'transition-all duration-300 cursor-default',
        c.glow
      )}
    >
      {/* Subtle top gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${c.bar} opacity-60`} />

      <div className="flex items-start justify-between mb-3">
        <div className={cn('p-2.5 rounded-xl border', c.icon)}>
          {Icon && <Icon size={18} />}
        </div>
        {trend !== undefined && (
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            trend >= 0 ? 'text-emerald-400 bg-emerald-950/60' : 'text-red-400 bg-red-950/60'
          )}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>

      <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground/60 mt-1">{subtitle}</p>}
    </motion.div>
  );
};
