import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  PackageSearch, 
  LineChart, 
  Settings, 
  X,
  LogOut,
  BrainCircuit,
  Leaf
} from 'lucide-react';

export default function Sidebar({ isMobileMenuOpen, toggleMobileMenu, handleLogout }) {
  const location = useLocation();

  // Navigation config array
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Live Orders', path: '/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <PackageSearch size={20} /> },
    { name: 'AI Forecasts', path: '/forecasts', icon: <BrainCircuit size={20} /> },
    { name: 'Waste Tracking', path: '/waste-reports', icon: <Leaf size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <LineChart size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside 
      className={`fixed lg:static inset-y-0 left-0 z-50 w-96 flex flex-col transition-transform duration-300 ease-in-out border-r border-sidebar-border shadow-2xl lg:shadow-none ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
      style={{ 
        backgroundColor: 'var(--sidebar)', 
        color: 'var(--sidebar-foreground)'
      }}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--sidebar-border)] shrink-0">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
          <div className="h-8 w-8 rounded-md bg-[var(--primary)] flex items-center justify-center text-white">
            <BrainCircuit size={18} />
          </div>
          AuraLink<span className="text-[var(--primary)]">.</span>
        </Link>
        <button onClick={toggleMobileMenu} className="lg:hidden text-white/70 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-hide">
        <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 px-3">
          Platform Menu
        </div>
        
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path} 
              onClick={() => toggleMobileMenu(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-[var(--sidebar-primary)] text-white shadow-lg shadow-primary/20' 
                  : 'text-white/70 hover:bg-[var(--sidebar-accent)] hover:text-white'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-white/50 group-hover:text-white transition-colors'}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-[var(--sidebar-border)] shrink-0">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-white/70 hover:bg-rose-500/10 hover:text-rose-400 transition-colors group"
        >
          <LogOut size={20} className="text-white/50 group-hover:text-rose-400 transition-colors" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}