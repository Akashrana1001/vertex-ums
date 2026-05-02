import { cn } from '../../lib/utils';

export const Skeleton = ({ className, ...props }) => (
  <div
    className={cn(
      'rounded-lg bg-muted overflow-hidden relative',
      'after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/5 after:to-transparent',
      'after:animate-[shimmer_1.8s_infinite]',
      className
    )}
    {...props}
  />
);
