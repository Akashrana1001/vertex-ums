import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, LogOut } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { cn } from '../lib/utils';

export const Sidebar = ({ links }) => {
  const { user, logout } = useAuth();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-64 min-h-screen flex flex-col glass border-r border-white/[0.08] sticky top-0"
    >
      {/* Logo */}
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-[#6d4dff] rounded-xl flex items-center justify-center shadow-lg shadow-primary/35">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm tracking-tight">Vertex UMS</p>
            <p className="text-[11px] text-muted-foreground capitalize mt-0.5">
              {user?.role?.toLowerCase()} portal
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-primary/15 text-[#d0c8ff] border border-primary/25'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent'
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={cn(
                  'p-1.5 rounded-lg transition-all duration-150',
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}>
                  <Icon size={15} />
                </span>
                {label}
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-accent/50 mb-1">
          <div className="w-7 h-7 bg-gradient-to-br from-primary to-[#6d4dff] rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-150 group"
        >
          <LogOut size={14} className="group-hover:scale-110 transition-transform" />
          Sign out
        </button>
      </div>
    </motion.aside>
  );
};
