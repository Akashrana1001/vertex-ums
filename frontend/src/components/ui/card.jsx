import { cn } from '../../lib/utils';

export const Card = ({ className, children, ...props }) => (
  <div
    className={cn(
      'rounded-2xl border border-border bg-card text-card-foreground shadow-[0_10px_40px_-26px_rgba(82,39,255,0.5)] transition-all duration-200',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col space-y-1 p-6', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn('text-base font-semibold leading-tight tracking-tight', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className, children, ...props }) => (
  <div className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props}>
    {children}
  </div>
);
