import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  LineChart, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  X,
  LogOut,
  BrainCircuit
} from 'lucide-react';

export default function DashboardLayout({ children, handleLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when window resizes to desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Navigation config makes it easy to add new pages later
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders', path: '/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
    { name: 'AI Forecasts', path: '/forecasts', icon: <BrainCircuit size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <LineChart size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      
      {/* ==========================================
          MOBILE OVERLAY
          ========================================== */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* ==========================================
          SIDEBAR (Desktop & Mobile)
          ========================================== */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 ease-in-out border-r border-sidebar-border shadow-2xl lg:shadow-none ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ 
          backgroundColor: 'var(--sidebar)', 
          color: 'var(--sidebar-foreground)'
        }}
      >
        {/* Sidebar Header / Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--sidebar-border)]">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <div className="h-8 w-8 rounded-md bg-[var(--primary)] flex items-center justify-center text-white">
              <LayoutDashboard size={18} />
            </div>
            ShopSwift<span className="text-[var(--primary)]">.</span>
          </Link>
          <button onClick={toggleMobileMenu} className="lg:hidden text-white/70 hover:text-white">
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
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-[var(--sidebar-primary)] text-white shadow-lg shadow-primary/20' 
                    : 'text-white/70 hover:bg-[var(--sidebar-accent)] hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-white/50 group-hover:text-white'}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout Button */}
        <div className="p-4 border-t border-[var(--sidebar-border)]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-white/70 hover:bg-rose-500/10 hover:text-rose-400 transition-colors group"
          >
            <LogOut size={20} className="text-white/50 group-hover:text-rose-400" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ==========================================
          MAIN CONTENT COLUMN
          ========================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 glass-panel border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 sticky top-0">
          
          {/* Left side: Mobile Toggle & Search */}
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={toggleMobileMenu} 
              className="lg:hidden text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden sm:flex items-center gap-2 text-muted-foreground w-full max-w-md bg-muted/30 px-3 py-1.5 rounded-md border border-border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search orders, customers, or reports..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground text-foreground"
              />
              <span className="text-[10px] font-medium border border-border bg-background px-1.5 py-0.5 rounded text-muted-foreground">⌘K</span>
            </div>
          </div>

          {/* Right side: Actions & Profile */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-muted">
              <Bell size={20} />
              {/* Notification Dot */}
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background"></span>
            </button>
            
            <div className="h-8 w-px bg-border hidden sm:block"></div>
            
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-sm">
                AD
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium text-foreground leading-none mb-1">Admin User</span>
                <span className="text-[10px] text-muted-foreground leading-none">ShopSwift Ops</span>
              </div>
            </button>
          </div>
        </header>

        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-background relative">
          {/* Decorative subtle background elements to enhance the SaaS look */}
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none -z-10"></div>
          
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
