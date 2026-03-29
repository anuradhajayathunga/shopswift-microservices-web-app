import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

export default function Header({ toggleMobileMenu }) {
  return (
    <header className="h-16 glass-panel border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 sticky top-0 shrink-0">
      
      {/* Left side: Mobile Toggle & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => toggleMobileMenu(true)} 
          className="lg:hidden text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden sm:flex items-center gap-2 text-muted-foreground w-full max-w-md bg-muted/30 px-3 py-1.5 rounded-md border border-border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search inventory, orders, or forecasts..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground text-foreground"
          />
          <span className="text-[10px] font-medium border border-border bg-background px-1.5 py-0.5 rounded text-muted-foreground shadow-sm">
            ⌘K
          </span>
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
            AA
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-medium text-foreground leading-none mb-1">Adikari A.</span>
            <span className="text-[10px] text-muted-foreground leading-none">System Admin</span>
          </div>
        </button>
      </div>
      
    </header>
  );
}