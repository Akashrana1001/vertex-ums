import { cn } from '../../lib/utils';

export const Input = ({ className, type, ...props }) => (
  <input
    type={type}
    className={cn(
      'flex h-10 w-full rounded-xl border border-border bg-input px-4 py-2 text-sm text-foreground ring-offset-background',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'transition-all duration-150',
      className
    )}
    {...props}
  />
);
