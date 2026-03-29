import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children, handleLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = (state) => {
    // If a specific state is passed, use it. Otherwise, toggle the current state.
    if (typeof state === 'boolean') {
      setIsMobileMenuOpen(state);
    } else {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      
      {/* Mobile Dark Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => toggleMobileMenu(false)}
        />
      )}

      {/* Modular Sidebar */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
        handleLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Modular Header */}
        <Header toggleMobileMenu={toggleMobileMenu} />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-background relative">
          
          {/* Subtle SaaS Gradient Background */}
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none -z-10"></div>
          
          {/* Render the current page (Dashboard, Orders, etc.) */}
          <div className="max-w-9xl mx-auto w-full">
            {children}
          </div>
          
        </main>
      </div>
      
    </div>
  );
}