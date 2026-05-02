import { cn } from '../../lib/utils';

export const Progress = ({ value = 0, className, ...props }) => (
  <div
    role="progressbar"
    aria-valuenow={value}
    aria-valuemin={0}
    aria-valuemax={100}
    className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-secondary', className)}
    {...props}
  >
    <div
      className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);
