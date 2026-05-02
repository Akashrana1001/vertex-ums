import { cn } from '../lib/utils';

const COLORS = [
  'from-violet-600 to-indigo-500',
  'from-blue-600 to-cyan-500',
  'from-emerald-600 to-teal-500',
  'from-orange-600 to-amber-500',
  'from-pink-600 to-rose-500'
];

export const Avatar = ({ name = '', size = 'md', className }) => {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const color = COLORS[name.charCodeAt(0) % COLORS.length];
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base'
  };

  return (
    <div className={cn(
      `bg-gradient-to-br ${color} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`,
      sizes[size],
      className
    )}>
      {initials}
    </div>
  );
};
