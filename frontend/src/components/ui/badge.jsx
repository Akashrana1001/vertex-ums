import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-primary/40 bg-primary/15 text-[#cfc5ff]',
        secondary: 'border-border bg-secondary text-secondary-foreground',
        destructive: 'border-red-800/50 bg-red-950/60 text-red-300',
        success: 'border-emerald-700/50 bg-emerald-950/60 text-emerald-300',
        warning: 'border-amber-700/50 bg-amber-950/60 text-amber-300',
        outline: 'border-border bg-transparent text-foreground'
      }
    },
    defaultVariants: { variant: 'default' }
  }
);

export const Badge = ({ className, variant, children, ...props }) => (
  <span className={cn(badgeVariants({ variant }), className)} {...props}>
    {children}
  </span>
);
