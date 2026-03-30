import React, { useState } from 'react';
import { Menu, Search, Bell, Settings, User, LogOut, HelpCircle, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header({ toggleMobileMenu, onLogout }) {
  const [notificationCount] = useState(3);

  // Added 'read' state for a more realistic UI interaction
  const notifications = [
    { id: 1, title: 'Low Stock Alert', description: 'Organic Tomatoes below threshold', time: '5m ago', type: 'warning', read: false },
    { id: 2, title: 'New Order Received', description: 'Order #12847 from Restaurant XYZ', time: '12m ago', type: 'info', read: false },
    { id: 3, title: 'AI Forecast Ready', description: 'Weekly demand prediction updated', time: '1h ago', type: 'success', read: true },
  ];

  // Using your custom glass-panel utility for that high-end translucent effect
  return (
    <header className="h-20 sticky top-0 z-40 w-full glass-panel shadow-premium flex items-center justify-between px-4 sm:px-6">
      
      {/* Left side: Mobile Toggle & Search */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleMobileMenu(true)}
          className="lg:hidden h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          aria-label="Open Menu"
        >
          <Menu size={18} />
        </Button>
        
        {/* Modern SaaS Search / Command Input */}
        <div className="hidden sm:flex items-center w-full max-w-sm relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-9 pr-14 h-9 bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary/30 transition-all rounded-md shadow-sm text-sm"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm">
            <Command className="h-3 w-3" />
            <span>K</span>
          </kbd>
        </div>

        {/* Mobile Search Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <Search size={18} />
        </Button>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-1 sm:gap-2">
        
        {/* Help Button */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
        >
          <HelpCircle size={18} />
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            >
              <Bell size={18} />
              {notificationCount > 0 && (
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 shadow-premium border-border">
            <DropdownMenuLabel className="flex items-center justify-between py-2">
              <span className="font-semibold text-foreground">Notifications</span>
              {notificationCount > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-medium bg-muted text-muted-foreground">
                  {notificationCount} unread
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[320px] overflow-y-auto py-1">
              {notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id} 
                  className={cn(
                    "flex flex-col items-start p-3 m-1 cursor-pointer rounded-md transition-colors",
                    !notification.read ? "bg-accent/50" : "hover:bg-accent"
                  )}
                >
                  <div className="flex items-start justify-between w-full gap-2">
                    <div className="flex-1 space-y-1">
                      <p className={cn(
                        "text-sm leading-none",
                        !notification.read ? "font-semibold text-foreground" : "font-medium text-foreground/80"
                      )}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{notification.description}</p>
                    </div>
                    {/* Status Indicator */}
                    {!notification.read && (
                      <div className={cn(
                        "h-2 w-2 rounded-full shrink-0 mt-0.5 shadow-sm",
                        notification.type === 'warning' && "bg-amber-500",
                        notification.type === 'info' && "bg-primary",
                        notification.type === 'success' && "bg-emerald-500"
                      )} />
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground/80 mt-2 font-medium">{notification.time}</span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-2 cursor-pointer">
              <Button variant="ghost" className="w-full h-8 text-xs text-primary hover:text-primary hover:bg-primary/10">
                Mark all as read
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="h-5 w-px bg-border hidden sm:block mx-1" />
        
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-accent h-9 px-2 rounded-md transition-colors"
            >
              <Avatar className="h-7 w-7 border border-border shadow-sm">
                <AvatarImage src="/avatars/admin.jpg" alt="Adikari A." />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  AA
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-sm font-medium text-foreground leading-none">Adikari A.</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 shadow-premium border-border">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1.5 p-1">
                <p className="text-sm font-semibold leading-none text-foreground">Adikari A.</p>
                <p className="text-xs leading-none text-muted-foreground">admin@auralink.io</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer py-2">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Profile</span>
                <DropdownMenuShortcut className="text-xs text-muted-foreground">⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2">
                <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Settings</span>
                <DropdownMenuShortcut className="text-xs text-muted-foreground">⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Sign out</span>
              <DropdownMenuShortcut className="text-xs opacity-70">⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
    </header>
  );
}