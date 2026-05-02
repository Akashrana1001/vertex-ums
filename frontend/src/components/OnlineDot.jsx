import { cn } from '../lib/utils';

export const OnlineDot = ({ isOnline, className }) => (
  <span className={cn(
    'inline-block w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300',
    isOnline
      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
      : 'bg-zinc-600',
    className
  )} />
);
