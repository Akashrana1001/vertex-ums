import { Bell, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import useSocket from '../hooks/useSocket';
import { cn } from '../lib/utils';

export const Navbar = ({ title }) => {
  const { user } = useAuth();
  const { isConnected } = useSocket();

  return (
    <header className="h-14 glass border-b border-white/[0.08] flex items-center justify-between px-6 sticky top-0 z-40">
      <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <div className={cn(
          'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all',
          isConnected
            ? 'text-emerald-400 border-emerald-900/60 bg-emerald-950/40'
            : 'text-muted-foreground border-border bg-secondary'
        )}>
          {isConnected
            ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live</>
            : <><WifiOff size={10} /> Offline</>
          }
        </div>
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={15} />
        </button>
        <div className="w-7 h-7 bg-gradient-to-br from-primary to-[#6d4dff] rounded-lg flex items-center justify-center text-xs font-bold text-white">
          {user?.name?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
};
