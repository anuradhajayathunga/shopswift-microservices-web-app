import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";
import {
  Menu,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authAPI } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header({ toggleMobileMenu, onLogout }) {
  const { theme, setTheme } = useTheme();
  const [notificationCount] = useState(3);
  const [isSticky, setIsSticky] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);

  // Added 'read' state for a more realistic UI interaction
  const notifications = [
    {
      id: 1,
      title: "Low Stock Alert",
      description: "Organic Tomatoes below threshold",
      time: "5m ago",
      type: "warning",
      read: false,
    },
    {
      id: 2,
      title: "New Order Received",
      description: "Order #12847 from Restaurant XYZ",
      time: "12m ago",
      type: "info",
      read: false,
    },
    {
      id: 3,
      title: "AI Forecast Ready",
      description: "Weekly demand prediction updated",
      time: "1h ago",
      type: "success",
      read: true,
    },
  ];

  const toggleMode = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      const authenticated = authAPI.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (!authenticated) {
        setProfile(null);
        return;
      }

      const cachedProfile = authAPI.getUser();
      setProfile(cachedProfile);

      if (!cachedProfile?.email) {
        return;
      }

      try {
        const fullUser = await authAPI.getUserByEmail(cachedProfile.email);
        authAPI.saveUser(fullUser);
        setProfile(fullUser);
      } catch {
        // Keep cached profile when refresh fails.
      }
    };

    loadProfile();
  }, []);

  const displayName =
    profile?.name || profile?.email?.split("@")[0] || "Signed in user";
  const displayEmail = profile?.email || "";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "SU";

  return (
    <header
      className={`h-20 sticky top-0 z-40 w-full glass-panel shadow-premium flex items-center justify-between px-4 sm:px-6${
        isSticky ? "bg-background shadow-md fixed w-full" : "bg-transparent"
      }`}
    >
      {/* Left side: Mobile Toggle & Search */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleMobileMenu(true)}
          className="lg:hidden h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          aria-label="Open Menu"
        >
          <Menu size={25} />
        </Button>

        <div className="hidden sm:flex items-center w-full max-w-[250px] relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder="Search anything..."
            className="w-full h-9 pl-10  rounded-xl text-sm  transition-colors bg-card/80 dark:bg-card border border-border/70 dark:border-border hover:bg-card focus-visible:bg-card focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary/40"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border/80 bg-background/85 dark:bg-background/70 px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm">
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
        <div
          className="hover:text-primary px-2 group focus:ring-0 rounded-full flex justify-center items-center cursor-pointer text-muted-foreground relative"
          onClick={toggleMode}
        >
          <span className="flex items-center justify-center relative after:absolute after:w-10 after:h-10 after:rounded-full after:-top-1/2   group-hover:after:bg-lightprimary transition-colors">
            {theme === "light" ? (
              <Icon icon="tabler:moon" width="20" />
            ) : (
              <Icon
                icon="solar:sun-bold-duotone"
                width="20"
                className="group-hover:text-primary"
              />
            )}
          </span>
        </div>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-primary px-2 group focus:ring-0 rounded-full flex justify-center items-center cursor-pointer text-muted-foreground relative"
            >
              <Bell size={25} />
              {notificationCount > 0 && (
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 shadow-premium border-border"
          >
            <DropdownMenuLabel className="flex items-center justify-between py-2">
              <span className="font-semibold text-foreground">
                Notifications
              </span>
              {notificationCount > 0 && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-2 py-1  font-medium bg-primary/10 text-muted-foreground dark:bg-primary/20 dark:text-primary"
                >
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
                    !notification.read ? "bg-accent/50" : "hover:bg-accent",
                  )}
                >
                  <div className="flex items-start justify-between w-full gap-2">
                    <div className="flex-1 space-y-1">
                      <p
                        className={cn(
                          "text-sm leading-none",
                          !notification.read
                            ? "font-semibold text-foreground"
                            : "font-medium text-foreground/80",
                        )}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {notification.description}
                      </p>
                    </div>
                    {/* Status Indicator */}
                    {!notification.read && (
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full shrink-0 mt-0.5 shadow-sm",
                          notification.type === "warning" && "bg-amber-500",
                          notification.type === "info" && "bg-primary",
                          notification.type === "success" && "bg-emerald-500",
                        )}
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground/80 mt-2 font-medium">
                    {notification.time}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-2 cursor-pointer">
              <Button
                variant="ghost"
                className="w-full h-8 text-xs text-primary hover:text-primary hover:bg-primary/10"
              >
                Mark all as read
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <div className="h-5 w-px bg-border hidden sm:block mx-1" /> */}

        {/* User Profile Dropdown */}
        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center px-1 gap-2 hover:bg-accent h-9 rounded-full transition-colors"
              >
                <Avatar className="h-10 w-10 border border-border shadow-sm">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 shadow-premium border-border"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1.5 p-1">
                  <p className="text-sm font-semibold leading-none text-foreground">
                    {displayName}
                  </p>
                  {displayEmail && (
                    <p className="text-xs leading-none text-muted-foreground">
                      {displayEmail}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer py-2">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Profile</span>
                  <DropdownMenuShortcut className="text-xs text-muted-foreground">
                    ⇧⌘P
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer py-2">
                  <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Settings</span>
                  <DropdownMenuShortcut className="text-xs text-muted-foreground">
                    ⌘S
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Sign out</span>
                <DropdownMenuShortcut className="text-xs opacity-70">
                  ⇧⌘Q
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
