import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Dialog = ({ open, onOpenChange, children }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="dialog-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onOpenChange?.(false)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export const DialogContent = ({ className, children, onClose }) => (
  <motion.div
    initial={{ scale: 0.92, opacity: 0, y: 20 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    exit={{ scale: 0.92, opacity: 0, y: 20 }}
    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    className={cn(
      'relative glass-card rounded-2xl shadow-2xl w-full max-w-md',
      'border border-white/8',
      className
    )}
  >
    {onClose && (
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <X size={16} />
      </button>
    )}
    {children}
  </motion.div>
);

export const DialogHeader = ({ className, children }) => (
  <div className={cn('px-6 pt-6 pb-2', className)}>{children}</div>
);

export const DialogTitle = ({ className, children }) => (
  <h2 className={cn('text-lg font-semibold text-foreground', className)}>{children}</h2>
);

export const DialogDescription = ({ className, children }) => (
  <p className={cn('text-sm text-muted-foreground mt-1', className)}>{children}</p>
);

export const DialogFooter = ({ className, children }) => (
  <div className={cn('flex justify-end gap-3 px-6 pb-6 pt-2', className)}>{children}</div>
);

export const DialogBody = ({ className, children }) => (
  <div className={cn('px-6 py-4', className)}>{children}</div>
);
